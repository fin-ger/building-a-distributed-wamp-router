const {
    AnonymousAuthProvider,
    Connection,
    JSONSerializer,
    NodeWebSocketTransport,
} = require('@verkehrsministerium/kraftfahrstrasse');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS.split(',');
const TIMEOUT = parseInt(process.env.TIMEOUT) || 200;

function getTimestamp() {
    return +new Date();
}

function snooze(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randint(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

async function main() {
    const hostname = os.hostname();
    while (true) {
        const timestamp = getTimestamp();
        try {
            const connection = new Connection({
                endpoint: ROUTER_ADDRESS[randint(0, ROUTER_ADDRESS.length - 1)],
                realm: 'default',

                serializer: new JSONSerializer(),
                transport: NodeWebSocketTransport,
                transportOptions: {
                    handshakeTimeout: TIMEOUT,
                    timeout: TIMEOUT,
                },
                authProvider: new AnonymousAuthProvider(),

                logFunction: (level, timestamp, file, msg) => {
                    if (level === 'INFO' || level === 'WARNING' || level === 'ERROR') {
                        console.log(level, timestamp, file, msg);
                    }
                },
            });

            await connection.Open();
            await connection.Close();

            console.log(`${hostname},${timestamp},1`);
        } catch (ex) {
            console.log(`${hostname},${timestamp},0`);
        }

        const duration = timestamp + TIMEOUT - new Date();
        await snooze(duration);
    }
}

main();
