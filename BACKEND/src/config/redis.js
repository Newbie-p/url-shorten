import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy(times){
        if(times > 3) return null;
        return Math.min(times*200, 1000);
    }
});

redis.on("connect", ()=>console.log("redis connected"));
redis.on("error", (err)=> console.error("redis error:", err));

export default redis;