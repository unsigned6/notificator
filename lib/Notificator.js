class Notificator {
    constructor(args) {
        this.pubsub = args.pubsub;
        this.isInited = false;
    }

    async init() {
        if (this.isInited) return;
        try {
            console.info('Notificator initialization started...');
            await this.pubsub.connect();
            await this.pubsub.createChannel('notifications');
            this.isInited = true;
            console.info('Notificator initialization completed.');
        } catch (error) {
            console.error('Notificator initialization failend.');
            console.error(error.message);
        }
    }

    notify(message) {
        if (!this.isInited) {
            console.warn('Can not notify. Notificator not inited');

            return;
        }
        try {
            this.pubsub.publish('notifications', message);
        } catch (error) {
            console.error('Failed to notify');
            console.error(error.message);
        }
    }

    receive(messageHandler) {
        if (!this.isInited) {
            console.warn('Can not receive. Notificator not inited');

            return;
        }
        this.pubsub.subscribe('notifications', messageHandler);
    }
}

module.exports = Notificator;
