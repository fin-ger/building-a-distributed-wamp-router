const mqtt = require('mqtt');
const os = require('os');
const fs = require('fs');
const util = require('util');

const open = util.promisify(fs.open);
const write = util.promisify(fs.write);

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

async function main() {
    const hostname = os.hostname();
    let _err, fd = await open(`/metrics/${hostname}.csv`, 'w');
    await write(fd, `${hostname},${getTimestamp()},init\n`);
    const client = mqtt.connect(ROUTER_ADDRESS);

    let resolve_key;
    let get_key = new Promise(resolve => resolve_key = resolve);

    client.on('connect', async () => {
        client.publish('emitter/keygen/', JSON.stringify({
            key: 'cSxjhk8xu6TvrvRGcXiIISUxEimpaAx5',
            channel: 'scaling-out/',
            type: 'rw',
        }));
        let key = await get_key;
        client.subscribe(`${key}/scaling-out/`);

        let msgs = 0;

        setInterval(async () => {
            await write(fd, `${hostname},${now},${msgs}\n`);
            msgs = 0;
        }, 0);

        setInterval(async () => {
            await new Promise(resolve => {
                client.publish(`${key}/scaling-out/`, '', resolve);
            });
            msgs += 1;
        }, 0);
    });

    client.on('message', function (topic, message, packet) {
        if (packet.topic === 'emitter/keygen/') {
            resolve_key(JSON.parse(packet.payload.toString()).key);
        }
    });
}

main();
