const notificator = require('../lib/notificatorSingletone');
const { pubsub }     = require('../etc/config');
const AbstractPubSub = require('../lib/AbstractPubSub');
const Notificator    = require('../lib/Norificator');
const RabbitDriver   = require('../lib/drivers/Rabbit');

describe('Notificator tests', () => {
    test('positive: can notify/recieve messages', async () => {
        await notificator.init();
        setTimeout(() => {
            notificator.notify({ test: 1 });
        }, 100);
        const result = await new Promise(res => notificator.receive((msg) => res(msg)));

        expect(result.test).toBe(1);
    });

    test('positive: can notify/recieve messages between different nodes', async () => {
        const { notificatorOne, notificatorTwo } = createNotifiactors();

        await notificatorOne.init();
        await notificatorTwo.init();

        setTimeout(() => {
            notificatorOne.notify({ test: 1 });
        }, 100);
        const result = await new Promise(res => notificatorTwo.receive((msg) => res(msg)));

        expect(result.test).toBe(1);
    });
});

function createNotifiactors() {
    const rabbitDriver = new RabbitDriver({
        endpoint : pubsub.endpoint,
        login    : pubsub.login,
        password : pubsub.password
    });
    const notificatorOne = new Notificator({
        pubsub : new AbstractPubSub({
            driver : rabbitDriver
        })
    });

    const notificatorTwo = new Notificator({
        pubsub : new AbstractPubSub({
            driver : rabbitDriver
        })
    });

    return { notificatorOne, notificatorTwo };
}