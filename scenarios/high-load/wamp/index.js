const {
    AnonymousAuthProvider,
    Connection,
    JSONSerializer,
    NodeWebSocketTransport,
} = require('@verkehrsministerium/kraftfahrstrasse');
const os = require('os');
const fs = require('fs');

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

async function main() {
    let stream = fs.createWriteStream(`/metrics/${os.hostname()}.csv`);

    const hostname = os.hostname();
    stream.write(`${hostname},${getTimestamp()},init`, 'ascii');

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
            stream.write(`${hostname},${now},${msgs}`, 'ascii');
            msgs = 0;
            time = now;
        }
        try {
            await connection.Publish('scenario.high_load');
            msgs += 1;
        } catch (err) {}
    }

    stream.end();
}

main();
