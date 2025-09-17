import { getShortUrl } from "../dao/short_url.js";
import { createShortUrlWithUser, createShortUrlWithoutUser } from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";
import { getUserUrls, deleteUserUrl } from "../dao/short_url.js";

export const createShortUrl = wrapAsync(async(req, res)=>{
    const {url}  = req.body;
    const userId = req.userId;
    const shortUrl = userId
        ? await createShortUrlWithUser(url, userId)
        : await createShortUrlWithoutUser(url);
    res.send(process.env.APP_URL + shortUrl)
})
    

export const redirectFromShortUrl = wrapAsync(async(req, res)=>{
    const { id } = req.params
    const url = await getShortUrl(id)
    if(!url) throw new Error("short URL not found")
    res.redirect(url.full_url)
})

export const listMyUrls = wrapAsync(async(req, res)=>{
    const userId = req.userId;
    const urls = await getUserUrls(userId);
    res.json({ success: true, data: urls });
})

export const deleteUrl = wrapAsync(async(req, res)=>{
    const { id } = req.params;
    const userId = req.userId;
    const result = await deleteUserUrl(id, userId);
    if (!result) {
        throw new Error("URL not found or you don't have permission to delete it");
    }
    res.json({ success: true, message: "URL deleted successfully" });
})