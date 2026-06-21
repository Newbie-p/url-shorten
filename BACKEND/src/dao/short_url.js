import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";
import redis from "../config/redis.js";

export const saveShortUrl = async(shortUrl, longUrl, userId, customAlias = false, expiresAt = null) =>{
    try{
        const newUrl = new urlSchema({
            full_url:longUrl,
            short_url:shortUrl,
            customAlias: customAlias,
            expiresAt: expiresAt,
        })
    if(userId){
        newUrl.user = userId;
    }
        await newUrl.save();
    }catch(err){
        if(err.code == 11000){
            throw new ConflictError("Short URL already exists");
        }
        throw new Error(err);
    }
    
}

export const getShortUrl = async(shortUrl)=>{

    // Check Redis cache first
    const cached = await redis.get(`url:${shortUrl}`);
    if(cached){
        const data = JSON.parse(cached);

        // Still increment click count in DB (non-blocking)
        urlSchema.findOneAndUpdate(
            { short_url: shortUrl },
            { $inc: { clicks: 1 } }
        ).exec();

        return data;
    }

    //not in cache - hit mongoDB
    const url =  await urlSchema.findOne({short_url:shortUrl});
    if(!url) return null;

    //check if link expired
    if(url.expiresAt && new Date() > url.expiresAt){
        return {expired: true};
    }

    await urlSchema.findOneAndUpdate(
        { short_url: shortUrl},
        { $inc: {clicks: 1 }}
    )

    //save to redis cache - expires after 24 hrs
     await redis.set(
        `url:${shortUrl}`,
        JSON.stringify({ full_url: url.full_url, expiresAt: url.expiresAt }),
        'EX', 86400
    );

    return url;
}

export const checkAliasExists = async(alias) => {
    const existing = await urlSchema.findOne({ short_url: alias });
    return !!existing;
}

export const getUserUrls = async(userId) =>{
  return await urlSchema.find({ user: userId }).sort({ createdAt: -1 });
}

export const deleteUserUrl = async(shortUrlId, userId) =>{
  const result = await urlSchema.findOneAndDelete({ _id: shortUrlId, user: userId });

  if(result){
    await redis.del(`url:${result.short_url}`);
  }
  return result;
}