/* eslint-disable no-unused-vars */
class PubSubDriverInterface {
    constructor(args) {
        this.channels = {};
        this.handlers = {};
    }

    async connect() {
        throw new Error('"connect" method not implemented');
    }

    async createChannel(channel) {
        throw new Error('"createChannel" method not implemented');
    }

    publish(topic, message) {
        throw new Error('"publish" method not implemented');
    }

    subscribe(topic) {
        throw new Error('"subscribe" method not implemented');
    }

    close() {
        throw new Error('"close" method not implemented');
    }
}

module.exports = PubSubDriverInterface;
