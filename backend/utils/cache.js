const { redisClient } = require('../config/redis');

const DEFAULT_TTL_SECONDS = 60;

/**
 * Lấy giá trị từ Redis cache.
 * Trả về null nếu key không tồn tại hoặc Redis lỗi.
 */
const getCache = async (key) => {
  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[Cache] getCache error (key=${key}):`, err.message);
    return null;
  }
};

/**
 * Lưu giá trị vào Redis với TTL (giây).
 */
const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  const safeTtl = Number(ttlSeconds) > 0 ? Number(ttlSeconds) : DEFAULT_TTL_SECONDS;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', safeTtl);
    return value;
  } catch (err) {
    console.error(`[Cache] setCache error (key=${key}):`, err.message);
    return value;
  }
};

/**
 * Xóa một key khỏi cache.
 */
const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`[Cache] deleteCache error (key=${key}):`, err.message);
  }
};

/**
 * Xóa tất cả keys có prefix cho trước.
 * Dùng SCAN thay KEYS để tránh block Redis trên production.
 */
const deleteCacheByPrefix = async (prefix) => {
  try {
    const pattern = `${prefix}*`;
    let cursor = '0';
    const keysToDelete = [];

    do {
      const [nextCursor, keys] = await redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      cursor = nextCursor;
      keysToDelete.push(...keys);
    } while (cursor !== '0');

    if (keysToDelete.length > 0) {
      await redisClient.del(...keysToDelete);
    }
  } catch (err) {
    console.error(`[Cache] deleteCacheByPrefix error (prefix=${prefix}):`, err.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix
};
