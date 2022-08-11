from bras_settings import bras_options

session_columns = {
    # Do not remove sid attribute. It is required for dropping session
    "sid": {
        "name": "si",  # Do not rename. It is used for dropping sessions
        "header": "SID",
        "type": "string",
        "operator": "contains",
        "defaultVisible": False,
    },
    "ifname": {
        "name": "if",  # Do not rename. It is used for dropping sessions context menu
        "header": "Ifname",
        "type": "string",
        "operator": "contains",
    },
    "username": {
        "name": "us",  # Do not rename. It is used for dropping sessions context menu
        "header": "Username",
        "type": "string",
        "operator": "contains",
        # "defaultWidth": 80, # Use it for any column if you want to change default column width
    },
    "state": {
        "name": "st",
        "header": "State",
        "type": "select",
        "operator": "inlist",
        "filterEditor": "SelectFilter",
        "filterEditorProps": {
            "multiple": True,
            "wrapMultiple": False,
            "dataSource": [
                {"id": "active", "label": "active"},
                {"id": "start", "label": "start"},
                {"id": "unk", "label": "unk"},
            ],
        },
    },
    # uptime is not required because raw field and render works fine
    #   "uptime": {
    #        "name": "uptime",
    #        "header": "Uptime",
    #        "type": "string",
    #        "operator": "contains",
    #    },
    "uptime-raw": {
        "name": "up",
        "header": "Uptime",
        "type": "number",
        "operator": "gte",
        "render": "Duration",
    },
    "ip": {"name": "ip", "header": "IP", "type": "string", "operator": "contains"},
    "ip6": {"name": "i6", "header": "IPv6", "type": "string", "operator": "contains"},
    "ip6-dp": {
        "name": "i6d",
        "header": "IPv6 DP",
        "type": "string",
        "operator": "contains",
    },
    "calling-sid": {
        "name": "cgs",
        "header": "Calling-Sid",
        "type": "string",
        "operator": "contains",
    },
    "called-sid": {
        "name": "cds",
        "header": "Called-Sid",
        "type": "string",
        "operator": "contains",
    },
    "comp": {
        "name": "cm",
        "header": "Compression",
        "type": "string",
        "operator": "contains",
    },
    "rate-limit": {
        "name": "rl",
        "header": "Rate-Limit",
        "type": "string",
        "operator": "contains",
    },
    "type": {
        "name": "ty",
        "header": "Type",
        "type": "select",
        "operator": "inlist",
        "filterEditor": "SelectFilter",
        "filterEditorProps": {
            "multiple": True,
            "wrapMultiple": False,
            "dataSource": [
                {"id": "ipoe", "label": "ipoe"},
                {"id": "l2tp", "label": "l2tp"},
                {"id": "pppoe", "label": "pppoe"},
                {"id": "pptp", "label": "pptp"},
                {"id": "sstp", "label": "sstp"},
            ],
        },
    },
    # rx-bytes and tx-bytes are not required because raw fields and render works fine
    #    "rx-bytes": {
    #        "name": "rx-bytes",
    #        "header": "RX",
    #        "type": "string",
    #        "operator": "contains",
    #    },
    #    "tx-bytes": {
    #        "name": "tx-bytes",
    #        "header": "TX",
    #        "type": "string",
    #        "operator": "contains",
    #    },
    "rx-bytes-raw": {
        "name": "rb",
        "header": "RX",
        "type": "number",
        "operator": "gte",
        "render": "size",
    },
    "tx-bytes-raw": {
        "name": "tb",
        "header": "TX",
        "type": "number",
        "operator": "gte",
        "render": "size",
    },
    "rx-pkts": {
        "name": "rp",
        "header": "RX pkts",
        "type": "number",
        "operator": "gte",
        "render": "size2",
    },
    "tx-pkts": {
        "name": "tp",
        "header": "RX pkts",
        "type": "number",
        "operator": "gte",
        "render": "size2",
    },
    # Uncomment if your VRF supported and used in your system
    #    "netns": {
    #        "name": "ns",
    #        "header": "Net NS",
    #        "type": "string",
    #        "operator": "contains",
    #        "defaultVisible": False,
    #    },
    # Uncomment if your VRF supported and used in your system
    #    "vrf": {
    #        "name": "v",
    #        "header": "VRF",
    #        "type": "string",
    #        "operator": "contains",
    #        "defaultVisible": False,
    #    },
}

bras_columns = {
    # Do not remove bras attribute. It is required for dropping session
    # Use '"defaultVisible": False' if you do not need this attribute
    "bras": {
        "name": "br",  # Do not rename. It is used for dropping sessions
        "header": "BRAS",
        "type": "select",
        "operator": "inlist",
        "filterEditor": "SelectFilter",
        "filterEditorProps": {
            "multiple": True,
            "wrapMultiple": False,
            "dataSource": [{"id": bras, "label": bras} for bras in bras_options.keys()],
        },
    },
    "key": {
        "name": "ke",  # Do not rename. It is required to have unique key
        "header": "Key",
        "type": "string",
        "operator": "contains",
        "defaultVisible": False,
    },
}
