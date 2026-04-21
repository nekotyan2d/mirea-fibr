import { getProducts as dbGetProducts } from "../../db.js";
import { Request, Response } from "express";
import { setCache } from "../../redis.js";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получает все товары
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Товары найдены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
export async function getProducts(req: Request, res: Response) {
    const products = dbGetProducts();
    await setCache(req.cacheKey, products, req.cacheTTL);
    return res.status(200).json({ source: "server", data: products });
}
