const { redisPubsub } = require("../etc/config");
const Notificator = require("../lib/Notificator");
const notificator = require("../lib/notificatorSingletonRedis");
const PubSub = require("../lib/PubSub");
const RedisDriver = require("../lib/drivers/Redis");

describe("Notificator with Redis driver tests", () => {
  // test("test placeholder", async () => {});
  test("positive: can notify/receive messages", async () => {
    await notificator.init();
    setTimeout(() => {
      notificator.notify({ test: 1 });
    }, 100);
    const result = await new Promise((res) =>
      notificator.receive((msg) => res(msg))
    );
    expect(result.test).toBe(1);
  });
  // test("positive: can notify/receive messages between different nodes", async () => {
  //   const notificatorOne = createNotificator();
  //   const notificatorTwo = createNotificator();
  //   await notificatorOne.init();
  //   await notificatorTwo.init();
  //   setTimeout(() => {
  //     notificatorOne.notify({ test: 1 });
  //   }, 100);
  //   const result = await new Promise((res) =>
  //     notificatorTwo.receive((msg) => res(msg))
  //   );
  //   expect(result.test).toBe(1);
  // });
});

function createNotificator() {
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

  return notificator;
}
