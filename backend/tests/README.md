# Backend tests

## Install dependencies

Install pytest using package manager or pip

```bash
$ sudo apt install python3-pytest python3-pytest-cov
```
or
```bash
$ pip3 install pytest pytest-cov
```

## Run tests

Run from `backend/` dir, not from current dir

```bash
user@host backend % python3 -m pytest -Werror --verbose --cov
```