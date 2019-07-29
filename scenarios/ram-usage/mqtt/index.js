const mqtt = require('mqtt');
const sleep = require('sleep');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

function snooze(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const hostname = os.hostname();
    const client = mqtt.connect(ROUTER_ADDRESS);

    let resolve_key;
    let get_key = new Promise(resolve => resolve_key = resolve);

    client.on('connect', async () => {
        client.publish('emitter/keygen/', JSON.stringify({
            key: 'cSxjhk8xu6TvrvRGcXiIISUxEimpaAx5',
            channel: 'ram-usage/',
            type: 'rw',
        }));
        let key = await get_key;
        client.subscribe(`${key}/ram-usage/`);

        while (true) {
            await new Promise(resolve => {
                client.publish(`${key}/ram-usage/`, '', resolve);
            });
            sleep.usleep(1000);
        }
    });

    client.on('message', function (topic, message, packet) {
        if (packet.topic === 'emitter/keygen/') {
            resolve_key(JSON.parse(packet.payload.toString()).key);
        }
    });
}

main();
