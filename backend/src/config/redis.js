import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
};

const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
  console.log('Redis Cache: Connection established');
});

redisClient.on('error', (err) => {
  console.error('Redis Cache: Connection failed', err);
});

export default redisClient;
