const PubSubDriverInterface = require('./drivers/PubSubDriverInterface');

class PubSub {
    constructor(args) {
        if (!args.driver) throw new Error('"driver" is required');
        if (!(args.driver instanceof PubSubDriverInterface)) throw new Error('Driver does not implement interface of "PubSubDriverInterface"');
        this.driver = args.driver;
    }

    async connect() {
        this.connection = await this.driver.connect();

        return this.connection;
    }

    async createChannel(channel) {
        return this.driver.createChannel(channel);
    }

    publish(channel, message) {
        return this.driver.publish(channel, message);
    }

    subscribe(channel, messageHandler) {
        return this.driver.subscribe(channel, messageHandler);
    }

    close() {
        return this.driver.close();
    }
}

module.exports = PubSub;
