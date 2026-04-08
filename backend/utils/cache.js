const cacheStore = new Map();

const DEFAULT_TTL_SECONDS = 60;

const now = () => Date.now();

const isExpired = (entry) => !entry || entry.expiresAt <= now();

const getCache = (key) => {
  const entry = cacheStore.get(key);

  if (!entry || isExpired(entry)) {
    cacheStore.delete(key);
    return null;
  }

  return entry.value;
};

const setCache = (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  const safeTtl = Number(ttlSeconds) > 0 ? Number(ttlSeconds) : DEFAULT_TTL_SECONDS;

  cacheStore.set(key, {
    value,
    expiresAt: now() + safeTtl * 1000
  });

  return value;
};

const deleteCache = (key) => {
  cacheStore.delete(key);
};

const deleteCacheByPrefix = (prefix) => {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
};

setInterval(() => {
  for (const [key, entry] of cacheStore.entries()) {
    if (isExpired(entry)) {
      cacheStore.delete(key);
    }
  }
}, 60 * 1000).unref();

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix
};
