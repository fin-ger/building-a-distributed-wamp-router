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
        client.subscribe('scenario/high-load');

        let msgs = 0;

        setInterval(() => {
            if (msgs > 0) {
                console.log(`${hostname},${getTimestamp()},${msgs}`);
                msgs = 0;
            }
        }, 1000);

        while (true) {
            try {
                await new Promise((resolve, reject) => {
                    let rejected = false;
                    let timeout = setTimeout(reject, 1000);
                    client.publish('scenario/high-load', '', () => {
                        if (!rejected) {
                            clearTimeout(timeout);
                            resolve();
                        }
                    });

                });
                msgs += 1;
            } catch (err) {}
        }
    });

    client.on('message', function (topic, message) {
    });
}

main();
