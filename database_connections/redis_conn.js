const Redis = require('redis');

const redisClient = Redis.createClient();

redisClient.on('connect', () => console.log('redis client connected'));

module.exports = redisClient;