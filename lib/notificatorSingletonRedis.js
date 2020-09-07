const { redisPubsub } = require("../etc/config");
const PubSub = require("./PubSub");
const Notificator = require("./Notificator");
const RedisDriver = require("./drivers/Redis");

const redisDriver = new RedisDriver({
  port: redisPubsub.port,
  host: redisPubsub.host,
  database: redisPubsub.database,
});
const notificator = new Notificator({
  pubsub: new PubSub({
    driver: redisDriver,
  }),
});

module.exports = notificator;
