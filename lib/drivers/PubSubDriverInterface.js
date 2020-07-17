/* eslint-disable no-unused-vars */
class PubSubDriverInterface {
    constructor(args) {
        if (!args.endpoint) throw new Error('"endpoint" is required');
        if (!args.login) throw new Error('"login" is required');
        if (!args.password) throw new Error('"password" is required');
        this.isReconnecting = false;
        this.endpoint = args.endpoint;
        this.login    = args.login;
        this.password = args.password;
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
