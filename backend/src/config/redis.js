const { createClient } =require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.ReDIS_PASS,
    socket: {
        host: 'redis-10503.c245.us-east-1-3.ec2.cloud.redislabs.com',
        port: 10503
    }
});

module.exports = redisClient;