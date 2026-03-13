import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

const redisUrl = env.UPSTASH_REDIS_REST_URL || 'https://default-upstash-url';
const redisToken = env.UPSTASH_REDIS_REST_TOKEN || 'default-token';

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
