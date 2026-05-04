const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'lKtjEaHRWfTZnVUnfmZbw1iF8ukDD9HN',
    socket: {
        host: 'redis-10971.c11.us-east-1-3.ec2.cloud.redislabs.com',
        port: 10971
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

module.exports = client;