import express from "express";
import { getUsers as getUsersInternal } from "../../db.js";
import { setCache } from "../../redis.js";
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получение списка всех пользователей
 *     description: Получение информации о всех пользователях
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

export async function getUsers(req: express.Request, res: express.Response) {
    const users = getUsersInternal();

    await setCache(req.cacheKey, users, req.cacheTTL);
    res.json({
        source: "server",
        data: users,
    });
}
