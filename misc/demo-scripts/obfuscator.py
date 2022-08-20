#!/usr/bin/env python3

import json
from pathlib import Path
from random import randint, seed

remap_mac = {}
remap_us = {}

us_f = ["STR", "Aven-", "User", "PON_", "DSL"]
us_p = ["-", "_", ""]

ip1_plus = randint(10, 200)  # ip obfuscating (new_ip)
ip2_plus = randint(10, 200)  # ip obfuscating (new_ip)


def new_mac(mac):
    if mac in remap_mac:
        print("remapping found for mac " + mac)
        return remap_mac[mac]
    print("remapping not found for mac " + mac)
    new_mac = "%02x:%02x:%02x:%02x:%02x:%02x" % (
        randint(0, 180),
        randint(0, 255),
        randint(0, 255),
        randint(0, 255),
        randint(0, 255),
        randint(0, 255),
    )
    remap_mac[mac] = new_mac
    return new_mac


def new_cds(cds):
    return cds.split(':', 1)[0]


def new_ip(ip):
    if ip.startswith("100.64") or ip == "":
        return ip
    else:
        a = ip.split(".")
        ip1 = (int(a[0]) + ip1_plus) % 220 + 1
        ip2 = (int(a[1]) + ip2_plus) % 220 + 1

        return str(ip1) + "." + str(ip2) + "." + a[2] + "." + a[3]


def new_us(us):
    if us in remap_us:
        print("remapping found for us " + us)
        return remap_us[us]
    print("remapping not found for us " + us)
    new_us = us_f[randint(0, 4)] + str(randint(0, 999)) + \
        us_p[randint(0, 2)] + str(randint(0, 999))
    remap_us[us] = new_us
    return new_us


def remap_f(inp):
    for ses in inp:
        r = {}
        r["us"] = new_us(ses["us"])
        r["cgs"] = new_mac(ses["cgs"])
        r["ip"] = new_ip(ses["ip"])
        r["cds"] = new_cds(ses["cds"])

        if ses["us"] != "":
            ses["us"] = r["us"]
        else:
            print("found empty us " + ses["ke"])
        if ses["cgs"] != "":
            ses["cgs"] = r["cgs"]
        else:
            print("found empty cgs " + ses["ke"])
        if ses["cds"] != "":
            ses["cds"] = r["cds"]
        else:
            print("found empty cds " + ses["ke"])
        if ses["ip"] != "":
            ses["ip"] = r["ip"]
        else:
            print("found empty cgs " + ses["ke"])


bras_list = ["all", "br1", "br2"]
dup_keys = ["us", "ip", "cgs", "cds"]

for bras in bras_list:
    sessions = json.loads(Path("sessions0/"+bras).read_text())["sessions"]
    remap_f(sessions)
    Path("sessions/"+bras).write_text(json.dumps(
        {"issues": {}, "sessions": sessions}, separators=(",", ":")))
    for dup_key in dup_keys:
        dups = json.loads(Path("duplicates0/" + bras+"/" +
                          dup_key).read_text())["sessions"]
        remap_f(dups)
        Path("duplicates/" + bras + "/" +
             dup_key).write_text(json.dumps(
                 {"issues": {}, "sessions": dups}, separators=(",", ":")))
