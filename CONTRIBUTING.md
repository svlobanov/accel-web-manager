# Contribution Guidelines

> Please use English for all requests

Accel-web-manager is an open source project, and contributions of any kind are welcome and appreciated. Open issues, bugs, and enhancements are all listed on the [issues](https://github.com/svlobanov/accel-web-manager/issues) tab and labeled accordingly. Feel free to open bug tickets and make feature requests.

## Issues

If you encounter a bug, please file a bug report. If you have a feature to request, please open a feature request. If you would like to work on an issue or feature, there is no need to request permission. Please test any new feature.

## Pull Requests

In order to create a pull request for accel-web-manager, follow the GitHub instructions for [Creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Please link your pull request to an existing issue.

## Folder Structure

Description of the project files and directories.
```bash

├── backend                                         # Backend source code and configuration files
│   ├── accel-web-manager.py                        # Backend application
│   ├── bras_settings.py                            # BRAS configuration list: name, host, connection options
│   ├── column_settings.py                          # Session columns configuration
│   ├── role_settings.py                            # Privileges configuration
│   └── visual_settings.py                          # Visual settings (session grid styles, notification options)
├── frontend                                        # Backend source code
│   ├── public                                      # Files that will write to dist on build
│   ├── src                                         # Frontend source code
│   │   ├── components                              # React components
│   │   ├── utils                                   # Functions to perform actions (load sessions, drop sessions, etc)
│   │   │   └── ui                                  # Auxiliary UI functions
│   │   ├── App.css                                 # Base CSS                   
│   │   ├── App.js                                  # Entry point for UI
│   ├── .gitignore                                  # Files ignored by git for frontend
│   ├── package-lock.json                           # Package lockfile
│   └── package.json                                # Frontend dependencies and additional information
├── misc                                            # Auxiliary configurations and scripts for running in prod
│   ├── nginx                                       # nginx web server configuration examples
│   │   ├── accel-web-manager                       # nginx configuration file example
│   │   └── users.htpasswd                          # Users configuration example
│   └── systemd                                     # systemd configuration examples
│       └── accel-web-manager.service               # systemd unit file for backend start
├── LICENSE                                         # License for this open source project
└── README.md
```

## Technologies

This project is possible thanks to all these open source languages, libraries, and frameworks.

| Tech                                                  | Description                                |
| ------------------------------------------------------| -------------------------------------------|
| [React](https://reactjs.org/)                         | Frontend JS framework                      |
| [Toastify](https://fkhadra.github.io/react-toastify)  | Frontend notification component            |
| [ReactDataGrid](https://reactdatagrid.io/)            | Frontend grid component                    |
| [Axios](https://axios-http.com/)                      | Frontend http client                       |
| [Luxon](https://moment.github.io/luxon/)              | Frontend time formatter library            |
| [Filesize](https://filesizejs.com/)                   | Frontend unit converter library            |
| [Flask](https://flask.palletsprojects.com/)           | Backend Python framework                   |
| [Gunicorn](https://gunicorn.org/)                     | Web server for running Python applications |
| [Nginx](https://nginx.org/)                           | Web server for auxillary tasks             |
| [TakeNote](https://takenote.dev/)                     | Mark-down template for this doc :)         |
