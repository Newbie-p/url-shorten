import redis from "../config/redis.js";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 10;

const rateLimiter = async(req, res, next) =>{
    try{
        const userId = req.userId;
        const key = `rate_limit:${userId}`;

        const requests = await redis.incr(key);

        if(requests === 1){
            await redis.expire(key, WINDOW_SECONDS);
        }

        const ttl = await redis.ttl(key);
        res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - requests));
        res.setHeader("X-RateLimit-Reset", ttl);

        if(requests > MAX_REQUESTS){
            return res.status(429).json({
                success: false,
                message: `Too many requests. Try again in ${ttl} seconds.`
            });
        }
        next();
    }catch(error){
        console.error("Rate limiter error:", error);
        next();
    }
};

export default rateLimiter;