const redis = require("redis");
const { formatMessage, parseMessage } = require("../utils");
const PubSubDriverInterface = require("./PubSubDriverInterface");

class Redis extends PubSubDriverInterface {
  constructor(args) {
    super(args);
    if (!args.port) throw new Error('"port" is required');
    if (!args.host) throw new Error('"host" is required');
    if (!args.database) throw new Error('"database" is required');
    this.isReconnecting = false;
    this.port = args.port;
    this.host = args.host;
    this.database = args.database;
  }

  async connect() {
    return new Promise(async (resolve) => {
      try {
        this.connection = await new Promise((res) => {
          const subscriber = redis.createClient(this.port, this.host, {
            db: this.database,
          });
          const publisher = redis.createClient(this.port, this.host, {
            db: this.database,
          });
          res({ subscriber, publisher });
        });
      } catch (error) {
        console.error(`Failed to connect to ${this.host}:${this.port}`);
        await new Promise((res) => setTimeout(() => res(), 5000));
        console.info("Trying to reconnect...");

        return this.connect();
      }

      this.connection.subscriber.on("error", (error) => {
        console.error(error);
      });

      this.connection.publisher.on("error", (error) => {
        console.error(error);
      });

      this.connection.subscriber.on("ready", () => {
        console.info(
          `Subscriber connected to Redis on ${this.host}:${this.port}`
        );
      });

      this.connection.publisher.on("ready", () => {
        console.info(
          `Publisher connected to Redis on ${this.host}:${this.port}`
        );
      });

      if (this.isReconnecting) {
        await this._recreateChannels();
        await this._reassignHandlers();
        console.info("Reconnected successfully.");
        this.isReconnecting = false;
      }

      resolve(this.connection);
    });
  }

  async _recreateChannels() {
    console.info("Recreating channels...");
    for (const channelName in this.channels) {
      if (!this.channels[channelName]) continue;
      await this.createChannel(channelName);
    }
    console.info("Recreating channels completed.");
  }

  _reassignHandlers() {
    console.info("Reassigning handlers...");
    for (const channelName in this.handlers) {
      if (!this.handlers[channelName]) continue;
      console.info(`For channel: "${channelName}"`);
      for (const handler of this.handlers[channelName]) {
        console.info(`Subscribing for handler: "${handler.name}"`);
        this.subscribe(channelName, handler, true);
      }
    }
    console.info("Reassign handlers completed.");
  }

  async createChannel(channelName) {
    this.channels[channelName] = await new Promise((res, rej) => {
      this.connection.subscriber.on("subscribe", function (channel, count) {
        console.info(`Created channel "${channelName}"`);
        res(channel);
      });

      this.connection.subscriber.subscribe(channelName);
    });

    if (!this.handlers[channelName]) this.handlers[channelName] = [];

    return this.channels[channelName];
  }

  publish(exchange, message) {
    try {
      const formattedMessage = formatMessage(message);

      console.info(
        `Publishing message '${formattedMessage.slice(
          0,
          40
        )}...' to channel "${exchange}"`
      );
      if (!this.channels[exchange])
        throw Error(`Channel for exchange ${exchange} not exists`);
      this.connection.publisher.publish(
        exchange,
        Buffer.from(formattedMessage)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  subscribe(exchange, messageHandler, isReconnecting = false) {
    console.log("subscribe()");
    if (!this.channels[exchange])
      throw Error(`Channel for queue ${exchange} not exists`);

    this.connection.subscriber.on("message", (channel, message) => {
      this._messageHandler({ channel, message }, messageHandler);
    });

    if (!isReconnecting) this.handlers[exchange].push(messageHandler);
  }

  close() {
    console.log("close()");
    this.connection.subscriber.end(true);
    this.connection.publisher.end(true);
    console.info("Closed connection.");
  }

  _messageHandler({ channel, message }, messageHandler) {
    const messageString = message.toString();

    console.info(
      ` [x] Received on channel ${channel}: "${messageString.slice(0, 40)}...`
    );
    if (typeof messageHandler === "function")
      messageHandler(parseMessage(messageString));
  }
}

module.exports = Redis;
