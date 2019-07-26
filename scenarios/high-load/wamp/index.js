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
    console.log(`${hostname},${getTimestamp()},init`);

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

    try {
        await connection.Open();
    } catch (err) {
        process.exit(1);
    }
    connection.Subscribe(
        'scenario.high_load',
        () => {},
    );

    let msgs = 0;
    let time = getTimestamp();

    while (true) {
        let now = getTimestamp();
        if (now - time > 1000) {
            console.log(`${hostname},${now},${msgs}`);
            msgs = 0;
            time = now;
        }
        try {
            await connection.Publish('scenario.high_load');
            msgs += 1;
        } catch (err) {}
    }
}

main();
