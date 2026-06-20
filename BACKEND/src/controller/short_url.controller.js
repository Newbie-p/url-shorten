import { getShortUrl } from "../dao/short_url.js";
import { createShortUrlWithUser } from "../services/short_url.service.js";
import wrapAsync from "../utils/tryCatchWrapper.js";
import { getUserUrls, deleteUserUrl } from "../dao/short_url.js";
import { logClickEvent, getAnalyticsForUrl } from "../services/click_event.service.js";

export const createShortUrl = wrapAsync(async (req, res) => {
    const { url, customAlias, expiresAt } = req.body;
    const userId = req.userId;

    const shortId = await createShortUrlWithUser(url, userId, customAlias || null, expiresAt || null);

    res.json({ shortId });
});
    

export const redirectFromShortUrl = wrapAsync(async(req, res)=>{
    const { id } = req.params;
    const url = await getShortUrl(id);
    if(!url) throw new Error("short URL not found");

    if(url.expired){
        return res.status(410).json({
            success: false,
            message: "This link has expired"
        });
    }
    logClickEvent(id, req); 
    res.redirect(url.full_url);
})

export const listMyUrls = wrapAsync(async(req, res)=>{
    const userId = req.userId;
    const urls = await getUserUrls(userId);
    res.json({ success: true, data: urls });
})

export const getUrlAnalytics = wrapAsync(async (req, res) =>{
    const { id } = req.params;
    const userId = req.userId;

    const analytics = await getAnalyticsForUrl(id, userId);
    res.json({ success: true, data: analytics});
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
