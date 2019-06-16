#! /bin/sh

set -e

fail() {
    printf "\e[1;31m !!! \e[1;0m%s\e[0m\n" "$@"
    exit 1
}

SCENARIO_NAME="pod-size"
SCENARIO="scenario-${SCENARIO_NAME}"
TIMESTAMP="$(date -Is)"

run() {
    CSV="plots/${TIMESTAMP}-${SCENARIO}.csv"

    mkdir -p plots

    docker pull emitter/server:latest
    printf 'emitter,' >> "${CSV}"
    docker image inspect emitter/server:latest --format '{{.Size}}' >> "${CSV}"

    docker pull crossbario/crossbar:cpy3
    printf 'crossbar,' >> "${CSV}"
    docker image inspect crossbario/crossbar:cpy3 --format '{{.Size}}' >> "${CSV}"

    docker pull fin1ger/autobahnkreuz-rs:latest
    printf 'autobahnkreuz,' >> "${CSV}"
    docker image inspect fin1ger/autobahnkreuz-rs:latest --format '{{.Size}}' >> "${CSV}"
}

run

./plot.py "plots/${TIMESTAMP}-${SCENARIO}"
