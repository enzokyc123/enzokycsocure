const { Redis } = require("@upstash/redis");
// Vercel's Upstash integration sets KV_REST_API_*; Upstash's own setup uses UPSTASH_REDIS_REST_*.
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});
module.exports = {
  set: (evalId, decision) => redis.set(`eval:${evalId}`, decision, { ex: 86400 }),
  get: async (evalId) => (await redis.get(`eval:${evalId}`)) || "PENDING",
};
