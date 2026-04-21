import { createClient } from "redis";

export const client = createClient({
    url: "redis://localhost:6379",
});

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.log("Redis Client Error", err));

export async function setCache(key?: string, value?: unknown, ttl: number = 60) {
    if (!key || value === undefined) {
        return;
    }

    try {
        await client.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    } catch (error) {
        console.error("Error setting cache:", error);
    }
}

export async function getCache(key?: string) {
    if (!key) {
        return null;
    }

    try {
        return await client.get(key);
    } catch (error) {
        console.error("Error getting cache:", error);
        return null;
    }
}

export async function delCache(key?: string) {
    if (!key) {
        return;
    }

    try {
        await client.del(key);
    } catch (error) {
        console.error("Error deleting cache:", error);
    }
}
