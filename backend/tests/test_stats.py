from unittest import mock
import json
import os


def mock_accel_cmd():
    return os.path.join(os.path.dirname(__file__), "mock_accel_cmd.py")


@mock.patch.dict("role_settings.privileges", {"showStats": True})
def test_stats_reply_allowed(client):
    response = client.get("/stats/all/general")
    # test that get /stats/all is ok (200) with showStats privilege
    assert response.status_code == 200


@mock.patch.dict("role_settings.privileges", {"showStats": False})
def test_stats_reply_denied(client):
    response = client.get("/stats/all/pppoe")
    # test that get /stats/all fails (403) without showStats privilege
    assert response.status_code == 403


@mock.patch.dict("role_settings.privileges", {"showStats": True})
@mock.patch.dict(
    "bras_settings.bras_options",
    {
        "br-test1": ["python3", mock_accel_cmd(), "0", "normal message"],
        "br-test2": ["non_existent_command", "-Hlocalhost", "-p2001"],
        "br-test3": ["python3", mock_accel_cmd(), "1", "message", "error message"],
    },
    clear=True,
)
def test_stats_reply_stats_custom_bras_config(client):
    response = client.get("/stats/all/general")
    print("/stats/all/general=" + str(response.data))

    # test that get /stats/all returns ok (200) with custom bras configuration
    assert response.status_code == 200

    reply = json.loads(response.data)

    # test that reply has stats for all bras
    assert len(reply["stats"]["br-test1"]) > 0
    assert len(reply["stats"]["br-test2"]) > 0
    assert len(reply["stats"]["br-test3"]) > 0

    # test that reply has no issue for br-test1
    assert "br-test1" not in reply["issues"]

    # test that reply has an issue for br-test2
    assert len(reply["issues"]["br-test2"]) > 0

    # test that reply has an issue for br-test3
    assert len(reply["issues"]["br-test3"]) > 0

    response2 = client.get("/stats/br-test1/pppoe")
    print("/stats/br-test1/pppoe=" + str(response.data))

    # test that get /stats/br-test1 returns ok (200) with custom bras configuration (existent bras)
    assert response2.status_code == 200

    reply2 = json.loads(response2.data)

    # test that reply2 returns only one bras in reply
    assert len(reply2["stats"]) == 1

    # test that reply2 has stats for br-test1
    assert len(reply2["stats"]["br-test1"]) > 0
