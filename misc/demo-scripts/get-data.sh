#!/usr/bin/env bash

# change accel-host to real hostname/ip or add a record to /etc/hosts

bras_list=(all br1 br2)
dup_keys=(us ip cgs cds)

mkdir -p data
mkdir -p data/sessions0
mkdir -p data/sessions
mkdir -p data/duplicates0
mkdir -p data/duplicates
mkdir -p data/stats

curl http://accel-host:5000/settings -o data/settings

for bras in ${bras_list[*]}; do
    curl http://accel-host:5000/stats/$bras -o data/stats/$bras
    curl http://accel-host:5000/sessions/$bras -o data/sessions0/$bras

    mkdir -p data/duplicates0/$bras
    mkdir -p data/duplicates/$bras
    for dup_key in ${dup_keys[*]}; do
        curl http://accel-host:5000/duplicates/$bras/$dup_key -o data/duplicates0/$bras/$dup_key
    done
    if [ "$bras" = "all" ]; then
        sleep 15
    fi
done
