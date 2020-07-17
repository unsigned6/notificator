module.exports = {
    pubsub : {
        endpoint : process.env.PUBSUB_ENDPOINT || 'localhost:5672',
        login    : process.env.PUBSUB_LOGIN || 'test',
        password : process.env.PUBSUB_PASSWORD || 'test'
    }
};
