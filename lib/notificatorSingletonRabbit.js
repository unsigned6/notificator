const { rabbitPubsub } = require("../etc/config");
const PubSub = require("./PubSub");
const Notificator = require("./Notificator");
const RabbitDriver = require("./drivers/Rabbit");

const rabbitDriver = new RabbitDriver({
  endpoint: rabbitPubsub.endpoint,
  login: rabbitPubsub.login,
  password: rabbitPubsub.password,
});
const notificator = new Notificator({
  pubsub: new PubSub({
    driver: rabbitDriver,
  }),
});

module.exports = notificator;
