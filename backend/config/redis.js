const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

/**
 * Client chính dùng cho cache.
 * Retry tối đa 10 lần đầu, sau đó giử delay tối đa 5s để không đóng connection.
 */
const createRedisClient = () => {
  const client = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: (times) => {
      if (times <= 10) {
        return Math.min(times * 100, 3000);
      }
      // Sau 10 lần: cảnh báo nhưng tiếp tục retry mãi với delay 5s
      console.warn(`[Redis] Đang retry lần thứ ${times}...`);
      return 5000;
    },
    lazyConnect: true,
  });

  client.on('connect', () => {
    console.log(`[Redis] Đã kết nối tới ${REDIS_HOST}:${REDIS_PORT}`);
  });

  client.on('error', (err) => {
    console.error('[Redis] Lỗi kết nối:', err.message);
  });

  client.on('close', () => {
    console.warn('[Redis] Kết nối đã đóng.');
  });

  return client;
};

/**
 * Client dùng cho Socket.IO Redis Adapter (pubClient / subClient).
 * Retry vô hạn với delay tối đa 5s — không bao giờ đóng connection.
 */
const createAdapterRedisClient = () => {
  const client = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: (times) => {
      return Math.min(times * 200, 5000);
    },
    lazyConnect: true,
  });

  client.on('connect', () => {
    console.log(`[Redis Adapter] Đã kết nối tới ${REDIS_HOST}:${REDIS_PORT}`);
  });

  client.on('error', (err) => {
    console.error('[Redis Adapter] Lỗi kết nối:', err.message);
  });

  client.on('close', () => {
    console.warn('[Redis Adapter] Kết nối đã đóng, đang thử lại...');
  });

  return client;
};

const redisClient = createRedisClient();

module.exports = { redisClient, createRedisClient, createAdapterRedisClient };
