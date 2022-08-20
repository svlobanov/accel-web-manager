import itertools
from ipaddress import IPv4Address

from duplicate_settings import duplicate_columns


def need_skip(skip_settings, val):
    if skip_settings.get("skip_empty", False):
        if val == "":
            return True
        else:
            return False
    if skip_settings.get("skip_private_ipv4", False):
        return IPv4Address(val).is_private


def get_duplicates(sessions, key):
    dup_vals = {}  # value => idx
    dup_vals_count = {}  # value => count
    dup_sessions = {}  # value => [sessions]

    skip_settings = duplicate_columns.get(key, {})

    for idx, session in enumerate(sessions):
        val = session[key]  # value to find duplicate
        if need_skip(skip_settings, val):  # value should be ignore
            continue

        cnt = dup_vals_count.get(val, 0)  # current duplicates count for value
        if cnt == 0:  # first time
            dup_vals[val] = idx  # save session idx to extract it if duplicate is found
            dup_vals_count[val] = 1
        elif cnt == 1:  # second time (first duplicate)
            dup_vals_count[val] = 2
            dup_sessions[val] = []
            dup_sessions[val].append(sessions[dup_vals[val]])  # add previous session
            dup_sessions[val].append(session)  # add current session
        else: # third or more time
            dup_sessions[val].append(session)  # add current session

    return list(
        itertools.chain.from_iterable([dup_sessions[val] for val in dup_sessions])
    )
