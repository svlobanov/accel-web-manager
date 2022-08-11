#!/usr/bin/env bash

# change accel-host to real hostname/ip or add a record to /etc/hosts
mkdir -p data
mkdir -p data/sessions0
mkdir -p data/sessions
mkdir -p data/stats

curl http://accel-host:5000/settings -o data/settings
curl http://accel-host:5000/stats/all -o data/stats/all
curl http://accel-host:5000/stats/br1 -o data/stats/br1
curl http://accel-host:5000/stats/br2 -o data/stats/br2
curl http://accel-host:5000/sessions/all -o data/sessions0/all
sleep 15
curl http://accel-host:5000/sessions/br1 -o data/sessions0/br1
curl http://accel-host:5000/sessions/br2 -o data/sessions0/br2
