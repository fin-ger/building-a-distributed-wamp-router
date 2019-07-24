const mqtt = require('mqtt');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

async function main() {
    const hostname = os.hostname();
    client = mqtt.connect(ROUTER_ADDRESS);

    client.on('connect', async () => {
        client.subscribe('scenario/scaling-out');

        let msgs = 0;
        let time = getTimestamp();

        while (true) {
            let now = getTimestamp();
            if (now - time > 1000) {
                console.log(`${hostname},${now},${msgs}`);
                msgs = 0;
                time = now;
            }
            await new Promise(resolve => {
                client.publish('scenario/scaling-out', '', resolve);
            });
            msgs += 1;
        }
    });

    client.on('message', function (topic, message) {
    });
}

main();
