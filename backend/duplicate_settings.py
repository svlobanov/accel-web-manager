duplicate_columns = {
    "us": {"skip_empty": True, "name": "Find Duplicates (User-Name)"},
    "ip": {
        "skip_empty": True,
        "skip_private_ip": True,
        "name": "Find Duplicates (Real IPv4)",
    },
    "cgs": {"skip_empty": True, "name": "Find Duplicates (Calling-Sid)"},
    "cds": {"skip_empty": True, "name": "Find Duplicates (Called-Sid)"},
}
