import { getProductById as dbGetProductById } from "../db.js";
import { Request, Response } from "express";

export function getProductById(req: Request, res: Response) {
    const { id } = req.params;

    // валидация
    if (!id) {
        return res.status(400).json({ message: "Missing product ID" });
    }

    const product = dbGetProductById(id as string);

    // проверяем, найден ли товар
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product: product });
}
