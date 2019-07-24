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

    client.on('connect', () => {
        client.subscribe('scenario/ram-usage');

        setTimeout(async () => {
            while (true) {
                const timestamp = getTimestamp();
                console.log('publishing topic scenario/ram-usage');
                await new Promise(resolve => {
                    client.publish('scenario/ram-usage', '', resolve);
                });
            }
        }, 0);
    });

    client.on('message', function (topic, message) {
        if (topic === 'scenario/ram-usage') {
            console.log('received topic scenario/ram-usage');
        }
    });
}

main();
