#! /bin/sh

set -e

fail() {
    printf "\e[1;31m !!! \e[1;0m%s\e[0m\n" "$@"
    exit 1
}

PROJECT_ROOT="../.."
SCENARIO_NAME="scaling-out"
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
        helm install --set "replicaCount=$1" --name autobahnkreuz . \
            || fail "failed to install autobahnkreuz chart"
    )
}

autobahnkreuz_down() {
    helm delete --purge autobahnkreuz || fail "failed to delete autobahnkreuz chart"
}

emitter_up() {
    # create subshell to prevent changing PWD
    (
        cd "${PROJECT_ROOT}/deployments/emitter" || fail "emitter helm chart not found"

        # it does not matter when this fails
        helm delete --purge emitter || true
        helm install --set "replicaCount=$1" --name emitter . \
            || fail "failed to install emitter chart"
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
        helm install \
             --set "routerAddress=${WAMP_ADDRESS}" \
             --set "replicaCount=$2" \
             --name "${SCENARIO}" . \
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
        helm install \
             --set "routerAddress=${MQTT_ADDRESS}" \
             --set "replicaCount=$2" \
             --name "${SCENARIO}" . \
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

    case "${ROUTER}" in
        autobahnkreuz)
            mkdir -p plots

            for i in 1 2 3 4 5
            do
                for node in $(kubectl get nodes -o json | jq -r '.items[].metadata.name')
                do
                    ssh "rancher@${node}" "sudo rm -rf /metrics/*"
                done

                autobahnkreuz_up $i
                sleep 10
                wamp_up "ws://autobahnkreuz:80" 5
                sleep 60

                LENGTH="$(date -d "now +5 min" +%s)"
                while [ "${LENGTH}" -ge "$(date +%s)" ]
                do
                    sleep 1
                done

                wamp_down
                autobahnkreuz_down

                mkdir -p plots/tmp
                for node in $(kubectl get nodes -o json | jq -r '.items[].metadata.name')
                do
                    scp -r "rancher@${node}:/metrics/*" plots/tmp || true
                done
                cat plots/tmp/* > "plots/${TIMESTAMP}-${SCENARIO}-$i-autobahnkreuz.csv"
                rm -r plots/tmp
            done

            return
            ;;
        emitter)
            mkdir -p plots

            for i in 1 2 3 4 5
            do
                for node in $(kubectl get nodes -o json | jq -r '.items[].metadata.name')
                do
                    ssh "rancher@${node}" "sudo rm -rf /metrics/*"
                done

                emitter_up $i
                sleep 10
                mqtt_up "ws://emitter:80" 5
                sleep 60

                LENGTH="$(date -d "now +5 min" +%s)"
                while [ "${LENGTH}" -ge "$(date +%s)" ]
                do
                    sleep 1
                done

                mqtt_down
                emitter_down

                mkdir -p plots/tmp
                for node in $(kubectl get nodes -o json | jq -r '.items[].metadata.name')
                do
                    scp -r "rancher@${node}:/metrics/*" plots/tmp || true
                done
                cat plots/tmp/* > "plots/${TIMESTAMP}-${SCENARIO}-$i-emitter.csv"
                rm -r plots/tmp
            done

            return
            ;;
        *)
            fail "invalid router ${ROUTER}"
    esac
}

run autobahnkreuz
run emitter

#./plot.py "plots/${TIMESTAMP}-${SCENARIO}"
