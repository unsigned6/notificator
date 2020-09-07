#!/usr/bin/env node
const notificator = require("../../lib/notificatorSingletonRedis");

async function main() {
  await notificator.init();

  notificator.receive(customMessageHandler);
}

function customMessageHandler(message) {
  console.log(`Via notificator received ${JSON.stringify(message)}`);
}

main();
