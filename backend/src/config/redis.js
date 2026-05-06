import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
};

const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
  console.log(`Redis Cache: Connection established at ${redisConfig.host}:${redisConfig.port}`);
});

redisClient.on('error', (err) => {
  console.error('Redis Cache: Connection failed', err);
});

export default redisClient;
