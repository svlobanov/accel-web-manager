import pytest
from accel_web_manager import create_app

@pytest.fixture()
def app():
    yield create_app()

@pytest.fixture()
def client(app):
    return app.test_client()
