import { generateNanoId } from "../utils/helper.js";
import { saveShortUrl, checkAliasExists } from "../dao/short_url.js";
import { ConflictError } from "../utils/errorHandler.js";

export const createShortUrlWithUser = async (url, userId, customAlias = null, expiresAt = null) =>{
    const shortUrl = customAlias || await generateNanoId(7);

    if(customAlias){
        const exists = await checkAliasExists(customAlias);
        if(exists) throw new ConflictError("This alias is already taken")
    }
    await saveShortUrl(shortUrl, url, userId, !!customAlias, expiresAt);
    return shortUrl;
}
