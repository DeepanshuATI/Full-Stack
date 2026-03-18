const { createClient } =require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.ReDIS_PASS,
    socket: {
        host: 'redis-18780.c80.us-east-1-2.ec2.cloud.redislabs.com',
        port: 18780
    }
});

module.exports = redisClient;