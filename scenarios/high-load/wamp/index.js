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

    await connection.Open();
    connection.Subscribe(
        'scenario.high_load',
        () => {},
    );

    let msgs = 0;
    let latency = 0;

    setInterval(() => {
        console.log(`${getTimestamp()},${hostname},${latency / msgs}`);
        msgs = 0;
        latency = 0;
    }, 1000);

    setInterval(async () => {
        const timestamp = getTimestamp();
        await connection.Publish('scenario.high_load');
        latency += getTimestamp() - timestamp;
        msgs += 1;
    }, 0);
}

main();
