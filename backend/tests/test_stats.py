def test_settings_reply(client):
    response = client.get("/stats/all")
    # test that get /stats/all is ok (200)
    assert response.status_code == 200
