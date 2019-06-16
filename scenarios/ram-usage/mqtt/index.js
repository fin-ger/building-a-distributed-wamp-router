const mqtt = require('mqtt');
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

    client.on('connect', async () => {
        client.subscribe('scenario/ram-usage');

        while (true) {
            const timestamp = getTimestamp();
            console.log('publishing topic scenario/ram-usage');
            client.publish('scenario/ram-usage', '');

            const duration = timestamp + 100 - new Date();
            await snooze(duration);
        }
    });

    client.on('message', function (topic, message) {
        if (topic === 'scenario/ram-usage') {
            console.log('received topic scenario/ram-usage');
        }
    });
}

main();
