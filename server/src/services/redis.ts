import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

let redisClient: any = null;
let sessionStore: any = null;

if (process.env.USE_REDIS === 'true') {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  redisClient.connect().catch((err: any) => {
    console.error('Could not connect to Redis:', err);
  });

  sessionStore = new RedisStore({
    client: redisClient,
    prefix: 'slicenspice:',
  });
  console.log('Using RedisStore for sessions.');
} else {
  console.log('Using MemoryStore for sessions (Development fallback).');
}

export { redisClient, sessionStore };
