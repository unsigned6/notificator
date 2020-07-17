#!/usr/bin/env node
const notificator = require('../../lib/notificatorSingletone');

async function main() {
    await notificator.init();

    notificator.receive(customMessageHandler);
}

function customMessageHandler(message) {
    console.log(`Via notificator received ${JSON.stringify(message)}`);
}

main();
