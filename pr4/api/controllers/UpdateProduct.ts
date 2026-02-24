import { getProductById as dbGetProductById, updateProduct as dbUpdateProduct } from "../db.js";
import { Request, Response } from "express";

export function updateProduct(req: Request, res: Response) {
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

    // извлекаем параметры из body
    const { name, category, description, price, amount, rating, photo } = req.body;

    // делаем замену. Если какой-либо параметр не был предоставлен, то будет использоваться старое
    dbUpdateProduct(id as string, { name, category, description, price, amount, rating, photo });

    return res.status(200).json({ message: "Product updated" });
}
