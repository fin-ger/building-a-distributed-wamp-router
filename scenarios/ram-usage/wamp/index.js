const {
    AnonymousAuthProvider,
    Connection,
    JSONSerializer,
    NodeWebSocketTransport,
} = require('@verkehrsministerium/kraftfahrstrasse');
const os = require('os');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

async function main() {
    const hostname = os.hostname();
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

    console.log('connecting...');
    try {
        await connection.Open();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('subscribing...');
    connection.Subscribe(
        'scenario.ram_usage',
        () => {},
    );

    console.log('publishing...');
    setInterval(async () => {
        try {
            await connection.Publish('scenario.ram_usage');
        } catch (err) {}
    }, 0);
}

main();
