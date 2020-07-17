#!/usr/bin/env node
const AbstractPubSub = require('../../lib/AbstractPubSub');
const RabbitDriver   = require('../../lib/drivers/Rabbit');

async function main() {
    const rabbitQueue = new AbstractPubSub({
        driver : new RabbitDriver({
            endpoint : 'localhost:5672',
            login    : 'test',
            password : 'test'
        })
    });

    await rabbitQueue.connect();
    await rabbitQueue.createChannel('tasks');

    // rabbitQueue.subscribe('tasks');
    rabbitQueue.subscribe('tasks', customMessageHandler);
}

function customMessageHandler(message) {
    console.log(`Custom handler ${message}`);
}

main();
