const {
    AnonymousAuthProvider,
    Connection,
    JSONSerializer,
    NodeWebSocketTransport,
} = require('@verkehrsministerium/kraftfahrstrasse');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

function snooze(ms) {
    new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const connection = new Connection({
        endpoint: ROUTER_ADDRESS,
        realm: 'default',

        serializer: new JSONSerializer(),
        transport: NodeWebSocketTransport,
        authProvider: new AnonymousAuthProvider(),

        logFunction: (level, timestamp, file, msg) => {
            if (level === 'INFO' || level === 'WARNING' || level === 'ERROR') {
                console.log(level, timestamp, file, msg);
            }
        },
    });

    while (true) {
        let timestamp = getTimestamp();
        try {
            await connection.Open();
            await connection.Close();
            console.log(`${timestamp},1`);
        } catch (ex) {
            console.log(`${timestamp},0`);
        }

        await snooze(10);
    }
}

main();
