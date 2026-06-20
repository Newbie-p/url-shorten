import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import clickEvent from "../models/click_event.model.js";
import shortUrl from "../models/short_url.model.js";
import { NotFoundError } from "../utils/errorHandler.js"

export const logClickEvent = async( shortUrl, req)=>{
    try{
        // get real Ip
        const ip = req.headers['x-forwarded-for']?.split(',')[0]
                || req.socket.remoteAddress || "Unknown";

        //geo lookup 
        const geo = geoip.lookup(ip);

        // device/ browser parsing
        const parser = new UAParser(req.headers['user-agent']);
        const result = parser.getResult();


        await clickEvent.create({
            shortUrl,
            ip,
            country: geo?.country || "Unknown",
            city: geo?.city || "Unknown",
            deviceType: result.device.type || "desktop",
            browser: result.browser.name || "Unknown",
            os: result.os.name || "Unknown",
        });
    }catch(error){
        console.error("Click logging failed: ", error);
    }
}

export const getAnalyticsForUrl = async (shortUrlCode, userId)=>{
    const url = await shortUrl.findOne({short_url: shortUrlCode, user: userId});
    
    if(!url){
        throw new NotFoundError(" URL not found or you don't have permission");
    }

    const events = await clickEvent.find({shortUrl: shortUrlCode}).sort({ createdAt: -1});

    const totalClicks = events.length;

    const deviceBreakdown = events.reduce((acc, e) => {
        acc[e.deviceType] = (acc[e.deviceType] || 0) + 1;
        return acc;
    }, {});

    const countryBreakdown = events.reduce((acc, e) => {
        acc[e.country] = (acc[e.country] || 0) + 1;
        return acc;
    }, {});

    const browserBreakdown = events.reduce((acc, e) => {
        acc[e.browser] = (acc[e.browser] || 0) + 1;
        return acc;
    }, {});

    const last7Days = events.filter(e => {
        const daysDiff = (Date.now() - new Date(e.createdAt)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    });

    return {
        totalClicks,
        deviceBreakdown,
        countryBreakdown,
        browserBreakdown,
        recentClicks: events.slice(0, 10),
        clicksLast7Days: last7Days.length,
    };
}