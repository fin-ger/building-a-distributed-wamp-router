#! /bin/sh

set -e

fail() {
    printf "\e[1;31m !!! \e[1;0m%s\e[0m\n" "$@"
    exit 1
}

PROJECT_ROOT="../.."
SCENARIO_NAME="availability"
SCENARIO="scenario-${SCENARIO_NAME}"
TIMESTAMP="$(date -Is)"

autobahnkreuz_up() {
    # create subshell to prevent changing PWD
    (
        mkdir -p "${PROJECT_ROOT}/vendor"
        cd "${PROJECT_ROOT}/vendor"

        rm -rf autobahnkreuz
        svn export "https://github.com/verkehrsministerium/autobahnkreuz-rs.git/trunk/dist/helm"
        mv helm autobahnkreuz

        cd autobahnkreuz

        # it does not matter when this fails
        helm delete --purge autobahnkreuz || true
        helm install --name autobahnkreuz . || fail "failed to install autobahnkreuz chart"
    )
}

autobahnkreuz_down() {
    helm delete --purge autobahnkreuz || fail "failed to delete autobahnkreuz chart"
}

crossbar_up() {
    # create subshell to prevent changing PWD
    (
        cd "${PROJECT_ROOT}/deployments/crossbar" || fail "crossbar helm chart not found"

        # it does not matter when this fails
        helm delete --purge crossbar || true
        helm install --name crossbar . || fail "failed to install crossbar chart"
    )
}

crossbar_down() {
    helm delete --purge crossbar || fail "failed to delete crossbar chart"
}

emitter_up() {
    # create subshell to prevent changing PWD
    (
        cd "${PROJECT_ROOT}/deployments/emitter" || fail "emitter helm chart not found"

        # it does not matter when this fails
        helm delete --purge emitter || true
        helm install --name emitter . || fail "failed to install emitter chart"
    )
}

emitter_down() {
    helm delete --purge emitter || fail "failed to delete emitter chart"
}

wamp_up() {
    WAMP_ADDRESS="$1"

    # create subshell to prevent changing PWD
    (
        cd "${PROJECT_ROOT}/scenarios/${SCENARIO_NAME}/wamp" || fail "${SCENARIO} helm chart not found"

        # it does not matter when this fails
        helm delete --purge "${SCENARIO}" || true
        helm install --set "routerAddress=${WAMP_ADDRESS}" --name "${SCENARIO}" . \
            || fail "failed to install ${SCENARIO} chart"
    )
}

wamp_down() {
    helm delete --purge "${SCENARIO}" || fail "failed to delete ${SCENARIO} chart"
}

mqtt_up() {
    MQTT_ADDRESS="$1"

    # create subshell to prevent changing PWD
    (
        cd "${PROJECT_ROOT}/scenarios/${SCENARIO_NAME}/mqtt" || fail "${SCENARIO} helm chart not found"

        # it does not matter when this fails
        helm delete --purge "${SCENARIO}" || true
        helm install --set "routerAddress=${MQTT_ADDRESS}" --name "${SCENARIO}" . \
            || fail "failed to install ${SCENARIO} chart"
    )
}

mqtt_down() {
    helm delete --purge "${SCENARIO}" || fail "failed to delete ${SCENARIO} chart"
}

kill_random_pod() {
    SERVICE_NAME="$1"

    POD="$(kubectl get pods --selector "app.kubernetes.io/name=${SERVICE_NAME}" \
                   --output custom-columns=:.metadata.name \
                   --no-headers | grep -v ".*-0" | shuf -n 1)"

    kubectl delete pod --grace-period=1 "${POD}" || true
}

run() {
    ROUTER="$1"
    LENGTH="$(date -d "now +5 min" +%s)"

    case "${ROUTER}" in
        autobahnkreuz)
            autobahnkreuz_up
            sleep 10
            wamp_up "ws://autobahnkreuz:80"
            sleep 20

            while [ "${LENGTH}" -ge "$(date +%s)" ]
            do
                kill_random_pod "autobahnkreuz"
                sleep 5
            done

            mkdir -p plots
            kubectl logs \
                    --selector "app.kubernetes.io/name=${SCENARIO}" \
                    --max-log-requests 100 \
                    --tail 9223372036854775807 > "plots/${TIMESTAMP}-${SCENARIO}-autobahnkreuz.csv"

            wamp_down
            autobahnkreuz_down

            return
            ;;
        crossbar)
            crossbar_up
            sleep 10
            wamp_up "ws://crossbar:80/ws"
            sleep 20

            while [ "${LENGTH}" -ge "$(date +%s)" ]
            do
                kill_random_pod "crossbar"
                sleep 5
            done

            mkdir -p plots
            kubectl logs \
                    --selector "app.kubernetes.io/name=${SCENARIO}" \
                    --max-log-requests 100 \
                    --tail 9223372036854775807 > "plots/${TIMESTAMP}-${SCENARIO}-crossbar.csv"

            wamp_down
            crossbar_down

            return
            ;;
        emitter)
            emitter_up
            sleep 5
            mqtt_up "ws://emitter:80"
            sleep 10

            while [ "${LENGTH}" -ge "$(date +%s)" ]
            do
                  kill_random_pod "emitter"
                  sleep 5
            done

            mkdir -p plots
            kubectl logs \
                    --selector "app.kubernetes.io/name=${SCENARIO}" \
                    --max-log-requests 100 \
                    --tail 9223372036854775807 > "plots/${TIMESTAMP}-${SCENARIO}-emitter.csv"

            mqtt_down
            emitter_down

            return
            ;;
        *)
            fail "invalid router ${ROUTER}"
    esac
}

#run autobahnkreuz
#run crossbar
run emitter

./plot.py "plots/${TIMESTAMP}-${SCENARIO}"
