import pytest
from accel_web_manager import app


@pytest.fixture()
def app1():
#    app1 = app
#    app1.config.update(
#        {
#            "TESTING": True,
#        }
#    )
    yield app


@pytest.fixture()
def client(app1):
    return app1.test_client()
