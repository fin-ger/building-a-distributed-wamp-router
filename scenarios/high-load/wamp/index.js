const {
    AnonymousAuthProvider,
    Connection,
    JSONSerializer,
    NodeWebSocketTransport,
} = require('@verkehrsministerium/kraftfahrstrasse');
const os = require('os');
const fs = require('fs');
const util = require('util');

const open = util.promisify(fs.open);
const write = util.promisify(fs.write);

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;

function getTimestamp() {
    return +new Date();
}

async function main() {
    const hostname = os.hostname();
    let _err, fd = await open(`/metrics/${hostname}.csv`, 'w');
    await write(fd, `${hostname},${getTimestamp()},init\n`);

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

    console.log("connecting");

    try {
        await connection.Open();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    let msgs = 0;

    setInterval(async () => {
        await write(fd, `${hostname},${getTimestamp()},${msgs}\n`);
        msgs = 0;
    }, 1000);

    setInterval(async () => {
        try {
            await connection.Publish('scenario.high_load');
            msgs += 1;
        } catch (err) {}
    }, 1);
}

main();
