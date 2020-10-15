module.exports = {
  rabbitPubsub: {
    endpoint: process.env.PUBSUB_RABBIT_ENDPOINT || "localhost:5672",
    login: process.env.PUBSUB_RABBIT_LOGIN || "test",
    password: process.env.PUBSUB_RABBIT_PASSWORD || "test",
  },
  redisPubsub: {
    port: process.env.PUBSUB_REDIS_PORT || 6379,
    host: process.env.PUBSUB_REDIS_HOST || "localhost",
    database: process.env.PUBSUB_REDIS_DATABASE || 1,
  },
};
