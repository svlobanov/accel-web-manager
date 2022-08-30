from unittest import mock
import json
import os


def mock_accel_cmd():  # with stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd.py")


def mock_accel_cmd2():  # without stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd2.py")


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["non_existent_command", "arg1"],
    },
    clear=True,
)
def test_traffic_reply_allowed(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    # test that get /traffic/... is ok (200) with showSessions privilege
    assert response.status_code == 200


@mock.patch.dict("role_settings.privileges", {"showSessions": False})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["non_existent_command", "arg1"],
    },
    clear=True,
)
def test_traffic_reply_denied(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    # test that get /traffic/... fails (403) without showSessions privilege
    assert response.status_code == 403


session_not_found_mock = (
    " uptime-raw | rx-bytes-raw | tx-bytes-raw |  rx-pkts  |  tx-pkts  \n"
    "------------+--------------+--------------+-----------+-----------"
)


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", session_not_found_mock],
    },
    clear=True,
)
def test_traffic_session_not_found(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status is SESSION_NOT_FOUND
    assert reply["status"] == "SESSION_NOT_FOUND"


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", "some_useful_info"],
    },
    clear=True,
)
def test_traffic_header_not_found(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status message is not empty (and not ok) and traffic is empty
    assert (
        len(reply["status"]) > 0
        and reply["status"] != "ok"
        and bool(reply["traffic"]) == False
    )
    # test that status message contains info provided in accel-cmd output
    # this test is related to issue#1 (https://github.com/svlobanov/accel-web-manager/issues/1)
    assert "some_useful_info" in reply["status"]


more_than_one_session_mock = (
    " uptime-raw | rx-bytes-raw | tx-bytes-raw |  rx-pkts  |  tx-pkts  \n"
    "------------+--------------+--------------+-----------+-----------\n"
    " 2565       | 37752041     | 716022870    | 297905    | 710915    \n"
    " 2351       | 12352043     | 431222890    | 451908    | 890932    "
)


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", more_than_one_session_mock],
    },
    clear=True,
)
def test_traffic_more_than_one_session(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status message is not empty (and not ok) and traffic is empty
    assert (
        len(reply["status"]) > 0
        and reply["status"] != "ok"
        and bool(reply["traffic"]) == False
    )


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd(), "3", "out", "err"],
    },
    clear=True,
)
def test_traffic_accel_cmd_exit_code_3(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status message is not empty (and not ok) and traffic is empty
    assert (
        len(reply["status"]) > 0
        and reply["status"] != "ok"
        and bool(reply["traffic"]) == False
    )


one_session_normal_mock = (
    " uptime-raw | rx-bytes-raw | tx-bytes-raw |  rx-pkts  |  tx-pkts  \n"
    "------------+--------------+--------------+-----------+-----------\n"
    " 2351       | 12352043     | 431222890    | 451908    | 890932    "
)


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", one_session_normal_mock],
    },
    clear=True,
)
def test_traffic_one_session_normal(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status message is ok and has 5 required columns exist
    assert reply["status"] == "ok" and all(
        col in reply["traffic"] for col in ("tb", "rb", "tp", "rp", "up")
    )


one_session_four_cols_mock = (
    " uptime-raw | rx-bytes-raw | tx-bytes-raw |  rx-pkts  \n"
    "------------+--------------+--------------+-----------\n"
    " 2351       | 12352043     | 431222890    | 451908    "
)


@mock.patch.dict("role_settings.privileges", {"showSessions": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd2(), "0", one_session_four_cols_mock],
    },
    clear=True,
)
def test_traffic_one_session_four_cols(client):
    response = client.get("/traffic/bras/br-test1/sid/testsid123")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status message is not empty (and not ok) and traffic is empty
    assert (
        len(reply["status"]) > 0
        and reply["status"] != "ok"
        and bool(reply["traffic"]) == False
    )
