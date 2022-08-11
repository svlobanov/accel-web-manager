#!/usr/bin/env python3

import json
from pathlib import Path
from random import randint, seed

remap = {}

us_f = ["STR", "Aven-", "User", "PON_", "DSL"]
us_p = ["-", "_", ""]

all = json.loads(Path("sessions0/all").read_text())["sessions"]
br1 = json.loads(Path("sessions0/br1").read_text())["sessions"]
br2 = json.loads(Path("sessions0/br2").read_text())["sessions"]

seed(12412)


def gen_mac():
    return "%02x:%02x:%02x:%02x:%02x:%02x" % (
        randint(0, 180),
        randint(0, 255),
        randint(0, 255),
        randint(0, 255),
        randint(0, 255),
        randint(0, 255),
    )


def new_ip(ip):
    if ip.startswith("100.64") or ip == "":
        return ip
    else:
        a = ip.split(".")
        ip1 = int(a[0]) + 18
        ip2 = int(a[0]) - 15
        ip1 = 97 if ip1 < 0 else ip1
        ip2 = 23 if ip2 > 0 else ip2
        return str(ip1) + "." + str(ip2) + "." + a[2] + "." + a[3]


def remap_f(inp):
    for ses in inp:
        r = {}
        if ses["ke"] in remap:
            print("remapping found for " + ses["ke"])
            r = remap[ses["ke"]]
        else:
            print("remapping not found for " + ses["ke"])
            r["us"] = (
                us_f[randint(0, 4)]
                + str(randint(0, 999))
                + us_p[randint(0, 2)]
                + str(randint(0, 999))
            )
            r["cgs"] = gen_mac()
            r["ip"] = new_ip(ses["ip"])
            remap[ses["ke"]] = r

        if ses["us"] != "":
            ses["us"] = r["us"]
        else:
            print("found empty us " + ses["ke"])
        if ses["cgs"] != "":
            ses["cgs"] = r["cgs"]
        else:
            print("found empty cgs " + ses["ke"])

        if ses["ip"] != "":
            ses["ip"] = r["ip"]
        else:
            print("found empty cgs " + ses["ke"])


remap_f(all)
remap_f(br1)
remap_f(br2)

# print(remap)

Path("sessions/all").write_text(
    json.dumps({"issues": {}, "sessions": all}, separators=(",", ":"))
)
Path("sessions/br1").write_text(
    json.dumps({"issues": {}, "sessions": br1}, separators=(",", ":"))
)
Path("sessions/br2").write_text(
    json.dumps({"issues": {}, "sessions": br2}, separators=(",", ":"))
)
