const { pubsub }   = require('../etc/config');
const PubSub       = require('./PubSub');
const Notificator  = require('./Notificator');
const RabbitDriver = require('./drivers/Rabbit');

const rabbitDriver = new RabbitDriver({
    endpoint : pubsub.endpoint,
    login    : pubsub.login,
    password : pubsub.password
});
const notificator = new Notificator({
    pubsub : new PubSub({
        driver : rabbitDriver
    })
});

module.exports = notificator;
