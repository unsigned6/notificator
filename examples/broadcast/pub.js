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

    const msg = process.argv.slice(2).join(' ') || 'Do this!';

    rabbitQueue.publish('tasks', msg);

    setTimeout(() => {
        rabbitQueue.close();
        process.exit(0);
    }, 500);
}

main();
