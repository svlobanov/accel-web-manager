from unittest import mock
import sys
import flask

from accel_web_manager import create_app
import accel_web_manager


@mock.patch.object(sys, "hexversion", 0x03060000)
def test_old_python_version():
    app_old = create_app()
    print("sys.hexversion=" + hex(sys.hexversion))
    print("create_app()=" + str(app_old))

    # test that app is not created on old python version (3.6)
    assert app_old is None


def test_current_python_version():
    app_current = create_app()
    print("sys.hexversion=" + hex(sys.hexversion))
    print("create_app()=" + str(app_current))

    # test that app is created on current python version
    assert app_current is not None


@mock.patch.object(accel_web_manager, "flask_version", "2.1.0")
def test_flask_version_210():
    app_flask_210 = create_app()
    print("accel_web_manager.flask_version=" + accel_web_manager.flask_version)
    print("app_flask_210.config" + str(app_flask_210.config))

    # test that app uses property config['JSON_SORT_KEYS'] if flask version is 2.1.0
    assert app_flask_210.config["JSON_SORT_KEYS"] == False


@mock.patch.object(accel_web_manager, "flask_version", "2.2.2")
def test_flask_version_222():
    print("accel_web_manager.flask_version=" + accel_web_manager.flask_version)
    print("real flask version(flask.__version__)=" + flask.__version__)

    attribute_exception = False
    try:
        app_flask_222 = create_app()
        print("app_flask_222.json.sort_keys=" + str(app_flask_222.json.sort_keys))
    except AttributeError as err:
        attribute_exception = True  # it is ok if real flask version < 2.2.0
        print("attribute exception=" + str(err))

    # test that app uses json.sort_keys if flask version is 2.2.2
    assert attribute_exception == True or app_flask_222.json.sort_keys == False
