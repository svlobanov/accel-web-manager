#!/usr/bin/env python3

from dataclasses import asdict
from subprocess import Popen, PIPE
import sys
import itertools
from threading import Thread
import time

# from time import sleep  # debug only

from flask import Flask, make_response, jsonify, request, abort
from flask_cors import CORS
from flask_compress import Compress

from get_duplicates import get_duplicates

from column_settings import session_columns, bras_columns
from bras_settings import bras_options
from visual_settings import grid_settings, toast_settings
from role_settings import privileges
from duplicate_settings import duplicate_columns

if sys.hexversion < 0x03070000:
    sys.exit("Python 3.7 or newer is required")  # dict must be ordered

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
# brotli compression requires flask-compress >= 1.5.0
app.config["COMPRESS_ALGORITHM"] = "br"
CORS(app)
Compress(app)

# Execute the command and return exit_code, stdout and stdin
def exec_command(bras_options, command):
    process = Popen(bras_options + command, stdout=PIPE, stderr=PIPE)
    (output, err) = process.communicate()
    exit_code = process.wait()
    return (exit_code, output.decode("utf-8"), err.decode("utf-8"))


# Send 'show sessions' command to the bras and parse the output
def get_sessions(bras, bras_options, result):
    try:
        (exit_code, output, err) = exec_command(
            bras_options, ["show sessions"] + [",".join(session_columns.keys())]
        )
    except Exception as e:
        result["status"] = str(e)
        result["sessions"] = []
        return

    columns = {}  # parsed from header
    sessions = []
    if exit_code == 0:
        lines = output.splitlines()

        if len(lines) < 2:
            result["status"] = "header not found (< 2 lines)"
            result["sessions"] = []
            return

        header = lines[0].split("|")
        for column in header:
            columns[column.strip()] = len(column)  # save each column length

        for line in lines[2:]:
            session = {}
            pos = 0
            for attr, attr_len in columns.items():  # main parsing loop
                value = line[
                    pos : pos + attr_len
                ].strip()  # use column length saved before
                if session_columns[attr]["type"] == "number":
                    value = int(value)
                session[session_columns[attr]["name"]] = value
                pos += attr_len + 1  # +1 for separator ('|')

            session[bras_columns["bras"]["name"]] = bras  # bras columnn
            session[bras_columns["key"]["name"]] = (
                bras + "-" + session[session_columns["sid"]["name"]]
            )
            sessions.append(session)

        result["status"] = "ok"
        result["sessions"] = sessions
    else:
        result["status"] = err
        result["sessions"] = []


# Get session from all selected bras using multiple threads
def get_sessions_multiple(bras_options):
    data = {}  # this dict is used to collect data from all bras's

    for bras, options in bras_options.items():
        data[bras] = {}
        data[bras]["thread"] = Thread(
            target=get_sessions, args=(bras, options, data[bras])
        )
        data[bras]["thread"].start()
        # sleep(1)

    for bras, options in bras_options.items():
        data[bras]["thread"].join()  # wait for all threads

    issues = {
        bras: data[bras]["status"] for bras in data if data[bras]["status"] != "ok"
    }

    return (
        issues,
        list(itertools.chain.from_iterable([data[bras]["sessions"] for bras in data])),
    )


# Rest controller for getting sessions
@app.route("/sessions/<bras>")
def sessions(bras):
    if privileges["showSessions"] != True:
        abort(403)

    filt_bras_options = bras_options  # no bras filter (all sessions)
    if bras != "all":  # if there is a filter by bras
        filt_bras_options = {bras: bras_options[bras]}

    (issues, sessions) = get_sessions_multiple(filt_bras_options)
    return jsonify({"issues": issues, "sessions": sessions})


# Rest controller for finding duplicates sessions
@app.route("/duplicates/<bras>/<key>")
def sessions_duplicates(bras, key):
    if privileges["showSessions"] != True:
        abort(403)

    filt_bras_options = bras_options  # no bras filter (all sessions)
    if bras != "all":  # if there is a filter by bras
        filt_bras_options = {bras: bras_options[bras]}

    (issues, sessions) = get_sessions_multiple(filt_bras_options)
    session_duplicates = get_duplicates(sessions, key)
    return jsonify({"issues": issues, "sessions": session_duplicates})


# Send 'show stat' command to the bras and parse the output
def get_stats(bras, bras_options, result):
    try:
        (exit_code, output, err) = exec_command(bras_options, ["show stat"])
    except Exception as e:
        result["status"] = str(e)
        result["stats"] = str(e)
        return
    if exit_code == 0:
        result["status"] = "ok"
        result["stats"] = output
    else:
        result["status"] = err
        result["stats"] = err


# Get session from all selected bras using multiple threads
def get_stats_multiple(bras_options):
    data = {}  # this dict is used to collect data from all bras's

    for bras, options in bras_options.items():
        data[bras] = {}
        data[bras]["thread"] = Thread(
            target=get_stats, args=(bras, options, data[bras])
        )
        data[bras]["thread"].start()

    for bras, options in bras_options.items():
        data[bras]["thread"].join()  # wait for all threads

    issues = {
        bras: data[bras]["status"] for bras in data if data[bras]["status"] != "ok"
    }

    return (issues, {bras: data[bras]["stats"] for bras in data})


# Rest controller for getting stats
@app.route("/stats/<bras>")
def stats(bras):
    if privileges["showStats"] != True:
        abort(403)

    filt_bras_options = bras_options  # no bras filter (all stats)
    if bras != "all":  # if there is a filter by bras
        filt_bras_options = {bras: bras_options[bras]}

    (issues, stats) = get_stats_multiple(filt_bras_options)
    return jsonify({"issues": issues, "stats": stats})


@app.route("/settings")
def columns():
    return jsonify(
        {
            "columns": list(bras_columns.values()) + list(session_columns.values()),
            "gridSettings": grid_settings,
            "toastSettings": toast_settings,
            "brasList": list(bras_options.keys()),
            "privileges": privileges,
            "duplicateKeys": duplicate_columns,
        }
    )


# Rest controller for session dropping
@app.route("/session/bras/<bras>/sid/<sid>/mode/<mode>", methods=["DELETE"])
def drop_session(bras, sid, mode):
    if privileges["dropSession"] != True:
        abort(403)
    try:
        (code, out, err) = exec_command(
            bras_options[bras], ["terminate sid " + sid + " " + mode]
        )
    except Exception as e:
        return jsonify({"status": str(e)})

    if code == 0 and out == "" and err == "":
        return jsonify({"status": "ok"})
    else:
        return jsonify({"status": out + " " + err})


# Rest controller for getting session traffic data
@app.route("/traffic/bras/<bras>/sid/<sid>")
def get_traffic(bras, sid):
    if privileges["showSessions"] != True:
        abort(403)
    timestamp = time.time() # will be returned in normal case
    try:
        (code, out, err) = exec_command(
            bras_options[bras],
            [
                "show sessions match sid "
                + sid
                + " uptime-raw,rx-bytes-raw,tx-bytes-raw,rx-pkts,tx-pkts"
            ],
        )
    except Exception as e:
        return jsonify({"status": str(e), "traffic": {}})

    if code == 0 and err == "":  # normal case
        lines = out.splitlines()
        result = {}
        if len(lines) == 3: # main loop (one session found)
            line = lines[2]
            vals = line.split('|')
            if len(vals) == 5: # as requested by show sessions ...
                result["status"] = "ok"
                result["traffic"] = {'ts': timestamp}
                col_names = ['up', 'rb', 'tb', 'rp', 'tp']
                for i in range(5):
                    result["traffic"][col_names[i]] = int(vals[i].strip())  
            else:
                result["status"] = "error while parsing result (!=5 columns)"
                result["traffic"] = {}              
        elif len(lines) == 2:
            result["status"] = "SESSION_NOT_FOUND"
            result["traffic"] = {}
        elif len(lines) < 2:
            result["status"] = "header not found (< 2 lines)"
            result["traffic"] = {}
        else: # more than 3 lines in reply
            result["status"] = "found more than one session"
            result["traffic"] = {}

        return jsonify({"status": result["status"], "traffic": result["traffic"]})
    else:
        return jsonify({"status": out + " " + err, "traffic": {}})
