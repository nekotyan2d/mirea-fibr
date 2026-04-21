import { getUserById as dbGetUserById } from "../../db.js";
import { Request, Response } from "express";
import { setCache } from "../../redis.js";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка в параметрах запроса
 *       404:
 *         description: Пользователь не найден
 */
export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;

    // валидация
    if (!id) {
        return res.status(400).json({ message: "Missing user ID" });
    }

    const user = dbGetUserById(id as string);

    // проверяем, найден ли пользователь
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await setCache(req.cacheKey, user, req.cacheTTL);

    return res.status(200).json({ source: "server", data: user });
}
