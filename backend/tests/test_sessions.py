from unittest import mock
import json
import os


def mock_accel_cmd():  # with stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd.py")


def mock_accel_cmd2():  # without stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd2.py")


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
def test_sessions_reply_allowed(client):
    response = client.get("/sessions/all")
    # test that get /sessions/all is ok (200) with showSessions privilege
    assert response.status_code == 200


@mock.patch.dict("role_settings.privileges", {"showSessions": False})
def test_sessions_reply_denied(client):
    response = client.get("/sessions/all")
    # test that get /sessions/all fails (403) without showSessions privilege
    assert response.status_code == 403


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd(), "0", "some_useful_info"],
        "br-test2": ["non_existent_command", "-Hlocalhost", "-p2001"],
        "br-test3": ["python3", mock_accel_cmd(), "1", "message", "error_message"],
    },
    clear=True,
)
def test_sessions_error_cases(client):
    response = client.get("/sessions/all")
    print("/sessions/all=" + str(response.data))

    # test that get /sessions/all returns ok (200) with custom bras configuration
    assert response.status_code == 200

    reply = json.loads(response.data)

    # test that reply has issues for all bras
    assert len(reply["issues"]["br-test1"]) > 0
    assert len(reply["issues"]["br-test2"]) > 0
    assert len(reply["issues"]["br-test3"]) > 0

    # test that reply has no sessions
    assert len(reply["sessions"]) == 0

    # test that status message contains info provided in accel-cmd output
    # this test is related to issue#1 (https://github.com/svlobanov/accel-web-manager/issues/1)
    assert "some_useful_info" in reply["issues"]["br-test1"]

    # test that reply error message is included to issues for bras3
    assert "error_message" in reply["issues"]["br-test3"]

    response2 = client.get("/sessions/br-test2")
    print("/sessions/br-test2=" + str(response.data))

    # test that get /sessions/br-test1 returns ok (200) with custom bras configuration (existent bras)
    assert response2.status_code == 200

    reply2 = json.loads(response2.data)

    # test that reply2 has only one bras in reply
    assert len(reply2["issues"]) == 1

    # test that reply2 has an issue for br-test1
    assert len(reply2["issues"]["br-test2"]) > 0


mock_two_sessions = (
    "        sid       | ifname | state  | uptime-raw \n"
    "------------------+--------+--------+------------\n"
    " 946ed5a0ecc59c8f | ipoe0  | active | 13504      \n"
    " 146ed5a0ecc59c8f | ipoe1  | start  | 3          "
)
mock_columns_settings = {
    "sid": {
        "name": "si",
        "type": "string",
    },
    "ifname": {
        "name": "if",
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
}


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict("column_settings.session_columns", mock_columns_settings)
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", mock_two_sessions],
    },
    clear=True,
)
def test_sessions_normal_two_sessions(client):
    response = client.get("/sessions/all")
    print("/sessions/all=" + str(response.data))

    # test that get /sessions/all returns ok (200)
    assert response.status_code == 200

    reply = json.loads(response.data)

    # test that reply has no issues for br-test1
    assert len(reply["issues"]) == 0

    # test that reply has two sessions
    assert len(reply["sessions"]) == 2

    # test that first session has the same values as in mock_two_sessions
    assert (
        reply["sessions"][0]["si"] == "946ed5a0ecc59c8f"
        and reply["sessions"][0]["if"] == "ipoe0"
        and reply["sessions"][0]["st"] == "active"
        and reply["sessions"][0]["up"] == 13504
        and reply["sessions"][0]["br"] == "br-test1"
        and reply["sessions"][0]["ke"] == "br-test1-946ed5a0ecc59c8f"
    )
