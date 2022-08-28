from unittest import mock
import json
import os


def mock_accel_cmd():  # with stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd.py")


def mock_accel_cmd2():  # without stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd2.py")


def mock_accel_cmd3():  # without stderr
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd3.py")


@mock.patch.dict("role_settings.privileges", {"dropSession": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["non_existent_command", "arg1"],
    },
    clear=True,
)
def test_drop_session_allowed(client):
    response = client.delete("/session/bras/br-test1/sid/testsid123/mode/soft")
    # test that delete /session/... is ok (200) with dropSession privilege
    assert response.status_code == 200


@mock.patch.dict("role_settings.privileges", {"dropSession": False})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["non_existent_command", "arg1"],
    },
    clear=True,
)
def test_drop_session_denied(client):
    response = client.delete("/session/bras/br-test1/sid/testsid123/mode/soft")
    # test that delete /session/... fails (403) without dropSession privilege
    assert response.status_code == 403


@mock.patch.dict("role_settings.privileges", {"dropSession": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd3(), "0"],
    },
    clear=True,
)
def test_drop_session_normal(client):
    response = client.delete("/session/bras/br-test1/sid/testsid123/mode/soft")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status of delete /session/... is ok in normal case (accel-cmd returns nothing)
    assert reply["status"] == "ok"


@mock.patch.dict("role_settings.privileges", {"dropSession": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd3(), "5"],
    },
    clear=True,
)
def test_drop_session_exit_5(client):
    response = client.delete("/session/bras/br-test1/sid/testsid123/mode/soft")
    print("response.data=" + str(response.data))
    reply = json.loads(response.data)
    # test that status of delete /session/... is not ok if accel-cmd return exit code 5
    assert len(reply["status"]) > 0 and reply["status"] != "ok"
