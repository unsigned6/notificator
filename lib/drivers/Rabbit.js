const amqp = require('amqplib/callback_api');
const {
    formatMessage,
    parseMessage
} = require('../utils');
const PubSubDriverInterface = require('./PubSubDriverInterface');

class Rabbit extends PubSubDriverInterface {
    constructor(args) {
        super(args);
    }

    async connect() {
        const connectString = `amqp://${this.login}:${this.password}@${this.endpoint}`;

        try {
            this.connection = await new Promise((res, rej) => {
                amqp.connect(connectString, (error, connection) => {
                    if (error) return rej(error);

                    console.info(`Connected to RabbitMQ on ${connectString}`);
                    res(connection);
                });
            });
        } catch (error) {
            console.error(`Failed to connect to ${connectString}`);
            await new Promise(res => setTimeout(() => res(), 5000));
            console.info('Trying to reconnect...');

            return this.connect();
        }

        this.connection.on('error', (error) => {
            if (error.message !== 'Connection closing') {
                console.error('[AMQP] conn error');
                console.error(error);
                this.isReconnecting = true;

                return setTimeout(this.connect.bind(this), 5000);
            }
        });
        this.connection.on('close', () => {
            console.warn('[AMQP] reconnecting started');
            this.isReconnecting = true;

            return setTimeout(this.connect.bind(this), 5000);
        });

        if (this.isReconnecting) {
            await this._recreateChannels();
            await this._reassignHandlers();
            console.info('Reconnected successfully.');
            this.isReconnecting = false;
        }

        return this.connection;
    }

    async _recreateChannels() {
        console.info('Recreating channels...');
        for (const channelName in this.channels) {
            if (!this.channels[channelName]) continue;
            await this.createChannel(channelName);
        }
        console.info('Recreating channels completed.');
    }

    _reassignHandlers() {
        console.info('Reassigning handlers...');
        for (const channelName in this.handlers) {
            if (!this.handlers[channelName]) continue;
            console.info(`For channel: "${channelName}"`);
            for (const handler of this.handlers[channelName]) {
                console.info(`Subscribing for handler: "${handler.name}"`);
                this.subscribe(channelName, handler, true);
            }
        }
        console.info('Reassign handlers completed.');
    }

    async createChannel(channelName, pubsubMode = true) {
        this.channels[channelName] = await new Promise((res, rej) => {
            this.connection.createChannel((error, channel) => {
                if (error) {
                    console.error(`Failed to create channel "${channelName}"`);

                    return rej(error);
                }

                console.info(`Created channel "${channelName}"`);
                res(channel);
            });
        });

        this.channels[channelName].assertExchange(channelName, 'fanout', { durable: false });

        if (!this.handlers[channelName]) this.handlers[channelName] = [];

        return this.channels[channelName];
    }

    publish(exchange, message) {
        try {
            const formattedMessage = formatMessage(message);

            console.log('publish()');
            console.info(`Publishing message '${formattedMessage.slice(0, 40)}...' to channel "${exchange}"`);
            if (!this.channels[exchange]) throw Error(`Channel for exchange ${exchange} not exists`);
            this.channels[exchange].publish(exchange, '', Buffer.from(formattedMessage));
        } catch (error) {
            if (!this.isReconnecting && error.message === 'Channel closed') {
                this.isReconnecting = true;
                this.connect();
            }
            throw error;
        }
    }

    subscribe(exchange, messageHandler, isReconnecting = false) {
        console.log('subscribe()');
        if (!this.channels[exchange]) throw Error(`Channel for queue ${exchange} not exists`);

        this.channels[exchange].assertQueue('', { exclusive: true }, (error2, q) => {
            if (error2) throw error2;

            console.info(` [*] Waiting for messages for ${exchange}. To exit press CTRL+C`);
            this.channels[exchange].bindQueue(q.queue, exchange, '');

            this.channels[exchange].consume(q.queue, (message) => {
                this._messageHanler({ exchange, message, noAck: true }, messageHandler);
            }, { noAck: true });
        });
        if (!isReconnecting) this.handlers[exchange].push(messageHandler);
    }

    close() {
        console.log('close()');
        this.connection.close();
        console.info('Closed connection.');
    }

    _messageHanler({ queue, message, noAck = false }, messageHandler) {
        const messageString = message.content.toString();

        console.info(` [x] Received "${messageString.slice(0, 40)}...`);
        if (typeof messageHandler === 'function') messageHandler(parseMessage(messageString));
        if (noAck) return;

        setTimeout(() => {
            console.info(' [x] Done');
            this.channels[queue].ack(message);
        }, 1000);
    }
}

module.exports = Rabbit;
