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
            try {
                await new Promise((resolve, reject) => {
                    let rejected = false;
                    let timeout = setTimeout(reject, 1000);
                    client.publish('scenario/ram-usage', '', () => {
                        if (!rejected) {
                            clearTimeout(timeout);
                            resolve();
                        }
                    });

                });
            } catch (err) {}
        }
    });

    client.on('message', function (topic, message) {
        if (topic === 'scenario/ram-usage') {
            console.log('received topic scenario/ram-usage');
        }
    });
}

main();
