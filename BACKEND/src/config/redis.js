import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times){
        return Math.min(times*100, 2000);
    },
    reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true; // reconnect on this specific error
    }
    return false;
  }
});

redis.on("connect", ()=>console.log("redis connected"));
redis.on("error", (err)=> console.error("redis error:", err));

export default redis;