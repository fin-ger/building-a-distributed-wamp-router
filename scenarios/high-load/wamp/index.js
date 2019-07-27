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
    const hostname = os.hostname();
    let stream = fs.createWriteStream(`./metrics/${hostname}.csv`);

    stream.write(`${hostname},${getTimestamp()},init\n`, 'ascii');

    const connection = new Connection({
        endpoint: ROUTER_ADDRESS,
        realm: 'realm1',

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
        console.log(err);
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
            stream.write(`${hostname},${now},${msgs}\n`, 'ascii');
            msgs = 0;
            time = now;
        }
        try {
            await connection.Publish('scenario.high_load', [], {}, {
                acknowledge: true,
            });
            msgs += 1;
        } catch (err) {}
    }

    stream.end();
}

main();
