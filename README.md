# accel-web-manager

## Features

- **View Sessions** (using 'accel-cmd show sessions')
- **View Accel-PPP statistics** (using 'accel-cmd show stat')
- **Drop session** (soft and hard)
- **Find sessions** (sort, per-column filters, multiple filters)
- **Multiple BRAS** (one view for multiple BRAS)
- **Customizable session viewer** (column settings, default filter logic)
- **Exception handling** (System continues to work (show what it can) and notifies user if some BRAS are down)
- **Simple role system** (Possible to disable some features, e.g. disable session dropping)
- **No using stats or tracking** 

## Demo

[Link to the demo](https://svlobanov.github.io/accel-web-manager-demo/)

### Demo Limitations
- This demo uses static files so session uptime and other values will not be updated
- Session deletion does not work in the demo due to github pages do not support DELETE http method, but you can check how it should work (use context menu on session)

## Purposes / Use Cases
- Provide simple web interface for technical support staff (Internet/VPN service providers)
- Find session by IP, User-Name, Mac address in case of desynchronization with RADIUS or RADIUS server is not used

## Installation

In general, installation is easy and has minimal dependencies. All dependecies can be installed from Debian standard repositories. No need to install anything from third-party sources

### Requirements
- Python >= 3.7 for backend
- Debian Linux (>= 10 is recommended). It easy to adapt for another distros

### Installation guide
You can install accel-web-manager directly on BRAS or any other server.

Install dependencies.

```bash
$ sudo apt install python3-flask python3-flask-compress python3-flask-cors python3-gunicorn gunicorn3 nginx apache2-utils 
```

Download tarball and extract
```bash
$ wget https://github.com/svlobanov/accel-web-manager/releases/download/v0.1.0/accel-web-manager-v0.1.0.txz
$ sudo tar -xf accel-web-manager-v0.1.0.txz -C /var/lib/
```

Create systemd service for backend and run
```bash
$ sudo ln -s /var/lib/accel-web-manager/systemd/accel-web-manager.service /etc/systemd/system/
$ sudo systemctl daemon-reload
$ sudo systemctl enable accel-web-manager
$ sudo systemctl start accel-web-manager
```

Check backend running status
```bash
$ sudo systemctl status accel-web-manager
```

Create nginx configuration
```bash
$ sudo ln -s /var/lib/accel-web-manager/nginx/accel-web-manager /etc/nginx/sites-available/
$ sudo ln -s ../sites-available/accel-web-manager /etc/nginx/sites-enabled/
```

Optional step: setup SSL in the nginx configuration file. Please use nginx docs or a guide provided by your SSL provider

Highly recommended step: change admin password in `/var/lib/accel-web-manager/nginx/users.htpasswd`

```bash
$ sudo htpasswd /var/lib/accel-web-manager/nginx/users.htpasswd admin
```
Reload nginx
```bash
$ sudo systemctl reload nginx
```

Now follow http://YOUR_SERVER_IP_OR_HOSTNAME:8018/ (default creds: admin/accel if you have not change the password)

## Configuration

> Be careful with spaces when editing .py configuration files

It is required to restart the backend after changing any .py configuration file

```bash
$ sudo systemctl restart accel-web-manager
```

### BRAS List

Edit `/var/lib/accel-web-manager/backend/bras_settings.py` to change BRAS list

### Privileges

Edit `/var/lib/accel-web-manager/backend/role_settings.py` to disable features. Change `True` to `False` if you want to disable a feature

### Session columns customization

Edit `/var/lib/accel-web-manager/backend/column_settings.py` to change session columns order and other attributes

### Other visual settings

Edit `/var/lib/accel-web-manager/backend/visual_settings.py` to change other visual settings

## Contributing

> Please use English for all requests

Accel-web-manager is an open source project, and contributions of any kind are welcome and appreciated. Open issues, bugs, and feature requests are all listed on the [issues](https://github.com/svlobanov/accel-web-manager/issues) tab and labeled accordingly. Feel free to open bug tickets and make feature requests.

View [CONTRIBUTING.md](CONTRIBUTING.md) to learn about the style guide, folder structure, scripts, and how to contribute.

## Development

```bash
git clone https://github.com/svlobanov/accel-web-manager
```
> Please use your own fork for development

### Backend development

Just edit .py files in `backend` dir

Start backend in dev mode
```bash
cd backend
FLASK_APP=accel-web-manager.py flask run --host 127.0.0.1
```
Use `--host 0.0.0.0` if you want to access the backend from another host

By default, flask will start the backend on port 5000

### Frontend development

#### Frontend development requirements

For frontend development, nodejs and npm are required. Please install nodejs >= 18 and npm >= 8. For Linux distros you can use [nodesource](https://github.com/nodesource/distributions) binary repo. For MacOS use [homebrew](https://brew.sh/)

#### Frontend development guide

Open cloned `accel-web-manager` dir in your favorite IDE, open terminal, then
```bash
$ cd frontend
$ npm install
$ npm start
```

`npm install` will download and install required dependencies

By default, all API request will be sent to http://localhost:5000/. Please redefine it if required
```bash
# in frontend dir
$ echo "REACT_APP_FORCE_BASE_URL=http://YOUR_BACKEND_HOST:PORT/" > .env.development.local
```

Then stop the application id your IDE and start again using `npm start`

#### Build frontend for production

```bash
# in frontend dir
$ npm run build
```

## Build release tarball

It is required to fulfill the [requirements for frontend development](#frontend-development-requirements) to build a release.

```bash
# in root dir
misc/release-scripts/release.sh
```
> Do not run release.sh from 'release-scripts' dir

## Author

- Sergey V. Lobanov

## License

This project is open source and available under the [GPLv3 License](LICENSE).
