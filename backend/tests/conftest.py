import pytest
from accel_web_manager import app


@pytest.fixture()
def client():
    return app.test_client()
