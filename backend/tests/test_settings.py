def test_settings_reply(client):
    response = client.get("/settings")
    # test that get /settings is ok (200)
    assert response.status_code == 200
