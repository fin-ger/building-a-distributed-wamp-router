const mqtt = require('async-mqtt');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

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
                connectTimeout: 200,
                wsOptions: {
                    handshakeTimeout: 200,
                },
            });

            await connected(client);
            await client.end();

            console.log(`${hostname},${timestamp},1`);
        } catch (ex) {
            console.log(`${hostname},${timestamp},0`);
        }

        const duration = timestamp + 200 - new Date();
        await snooze(duration);
    }
}

main();
