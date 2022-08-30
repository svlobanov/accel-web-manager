from unittest import mock
import json
import os


def mock_accel_cmd2():  # without stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd2.py")


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
def test_duplicates_reply_allowed(client):
    response = client.get("/duplicates/all/us")
    # test that get /duplicates/all/us is ok (200) with showSessions privilege
    assert response.status_code == 200


@mock.patch.dict("role_settings.privileges", {"showSessions": False})
def test_duplicates_reply_denied(client):
    response = client.get("/duplicates/all/us")
    # test that get /duplicates/all/us fails (403) without showSessions privilege
    assert response.status_code == 403


mock_multi_sessions = (
    "        sid       |  username  | state  | uptime-raw |       ip        \n"
    "------------------+------------+--------+------------+-----------------\n"
    " 14bcc8313b6deeea |            | active | 4842330    | 1.2.3.2         \n"
    " 24bcc8313b6deeea |            | active | 4842320    | 1.2.3.5         \n"
    " 64bcc8313b6deeea | test123    | active | 4842320    | 1.2.3.122       \n"
    " 54bcc8313b6deeea | test123    | active | 4842321    | 100.64.0.0      \n"
    " 54bcc8313b6deeea | test234    | active | 4842321    | 100.64.0.0      \n"
    " 44bcc8313b6deeea | test123    | active | 4842322    | 1.2.3.122       \n"
    " 34bcc8313b6deeea | test124    | active | 4842324    | 2.2.9.122       "
)
mock_columns_settings = {
    "sid": {
        "name": "si",
        "type": "string",
    },
    "username": {
        "name": "us",
        "type": "string",
    },
    "state": {
        "name": "st",
        "type": "select",
    },
    "uptime-raw": {
        "name": "up",
        "type": "number",
    },
    "ip": {
        "name": "ip",
        "type": "string",
    },
}
mock_duplicate_columns = {
    "us": {"skip_empty": True},
    "ip": {"skip_empty": False, "skip_private_ip": True},
    "sid": {"skip_empty": False},
}


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict("column_settings.session_columns", mock_columns_settings)
@mock.patch.dict("duplicate_settings.duplicate_columns", mock_duplicate_columns)
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", mock_multi_sessions],
    },
    clear=True,
)
def test_duplicates_normal_two_sessions(client):
    response = client.get("/duplicates/br-test1/us")
    print("/duplicates/br-test1/us=" + str(response.data))

    # test that get /sessions/all returns ok (200)
    assert response.status_code == 200

    reply = json.loads(response.data)

    # test that reply has no issues for br-test1
    assert len(reply["issues"]) == 0

    # test that reply has three sessions
    assert len(reply["sessions"]) == 3

    # test that first session has the same values as in mock_two_sessions
    assert (
        reply["sessions"][0]["si"] == "64bcc8313b6deeea"
        and reply["sessions"][0]["us"] == "test123"
        and reply["sessions"][0]["st"] == "active"
        and reply["sessions"][0]["up"] == 4842320
        and reply["sessions"][0]["br"] == "br-test1"
        and reply["sessions"][0]["ke"] == "br-test1-64bcc8313b6deeea"
    )

    response2 = client.get("/duplicates/br-test1/ip")
    print("/duplicates/br-test1/ip=" + str(response.data))

    reply2 = json.loads(response2.data)

    # test that reply has two sessions
    assert len(reply2["sessions"]) == 2

    # test that reply has two sessions
    assert len(reply2["sessions"]) == 2

    # test that duplicate is found for global ip 1.2.3.122
    assert (
        reply2["sessions"][0]["ip"] == "1.2.3.122"
        and reply2["sessions"][1]["ip"] == "1.2.3.122"
    )
