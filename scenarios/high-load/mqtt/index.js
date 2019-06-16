const mqtt = require('mqtt');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

async function main() {
    const hostname = os.hostname();
    const client = mqtt.connect(ROUTER_ADDRESS);

    client.on('connect', async () => {
        client.subscribe('scenario/ram-usage');

        while (true) {
            const timestamp = getTimestamp();
            await new Promise(resolve => {
                client.publish('scenario/ram-usage', '', resolve);
            });
            console.log(`${hostname},${getTimestamp() - timestamp}`);
        }
    });

    client.on('message', function (topic, message) {
    });
}

main();
