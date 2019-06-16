const mqtt = require('async-mqtt');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;
const TIMEOUT = parseInt(process.env.TIMEOUT) || 200;

function getTimestamp() {
    return +new Date();
}

function snooze(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function connected(client) {
    return new Promise((resolve, reject) => {
        client.on('connect', resolve);
        client.on('close', reject);
    });
}

async function main() {
    const hostname = os.hostname();
    while (true) {
        const timestamp = getTimestamp();
        try {
            const client = mqtt.connect(ROUTER_ADDRESS, {
                connectTimeout: TIMEOUT,
                wsOptions: {
                    handshakeTimeout: TIMEOUT,
                },
            });

            await connected(client);
            await client.end();

            console.log(`${hostname},${timestamp},1`);
        } catch (ex) {
            console.log(`${hostname},${timestamp},0`);
        }

        const duration = timestamp + TIMEOUT - new Date();
        await snooze(duration);
    }
}

main();
