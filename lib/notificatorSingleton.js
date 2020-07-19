const { pubsub }     = require('../etc/config');
const AbstractPubSub = require('./AbstractPubSub');
const Notificator    = require('./Notificator');
const RabbitDriver   = require('./drivers/Rabbit');

const rabbitDriver = new RabbitDriver({
    endpoint : pubsub.endpoint,
    login    : pubsub.login,
    password : pubsub.password
});
const notificator = new Notificator({
    pubsub : new AbstractPubSub({
        driver : rabbitDriver
    })
});

module.exports = notificator;
