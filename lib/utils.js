function formatMessage(message) {
    let messageStr;

    if (typeof message === 'string') {
        messageStr = message;
    } else if (typeof message === 'object') {
        messageStr = JSON.stringify(message);
    }

    return messageStr;
}

function parseMessage(message) {
    try {
        return JSON.parse(message);
    } catch (error) {
        console.warn(`message ${message} an not be parsed as JSON`);

        return message;
    }
}

module.exports = {
    formatMessage,
    parseMessage
};
