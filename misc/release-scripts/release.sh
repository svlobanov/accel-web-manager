#!/usr/bin/env bash

# Run this script from root folder
VERSION=`git rev-parse --short HEAD`
DIR0="build/release-${VERSION}"
DIR="build/release-${VERSION}/accel-web-manager"

mkdir -pv build
rm -rfv "$DIR0"
mkdir -pv "$DIR0"
mkdir -pv "$DIR"

# Frontend
cd frontend
npm install
GENERATE_SOURCEMAP=false npm run build
cd ..
cp -Rpv frontend/build "${DIR}/frontend"

# Backend
mkdir -pv "${DIR}/backend"
cp -pv backend/*.py "${DIR}/backend"

# Systemd unit
cp -Rpv misc/systemd "${DIR}/systemd"

# Nginx config
cp -Rpv misc/nginx "${DIR}/nginx"

# Doc
cp -v README.md "${DIR}/"

# Build archive
cd "${DIR0}"
TAR=tar
gtar --version 2>/dev/null 1>/dev/null && TAR=gtar # workaround for macos
$TAR --owner root:0 --group root:0 -Jcf accel-web-manager-$VERSION.txz accel-web-manager/ || \
    echo "ERROR: Please install gnu tar (gtar)"