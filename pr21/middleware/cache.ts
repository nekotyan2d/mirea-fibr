import express from "express";
import { getCache } from "../redis.js";

export function cacheMiddleware(keyBuilder: (req: express.Request) => string, ttl: number = 60) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const key = keyBuilder(req);
            req.cacheKey = key;
            req.cacheTTL = ttl;

            const cachedData = await getCache(key);
            if (cachedData) {
                return res.json({
                    source: "cache",
                    data: JSON.parse(cachedData),
                });
            }

            return next();
        } catch (error) {
            console.error("Cache error:", error);
            return next();
        }
    };
}
