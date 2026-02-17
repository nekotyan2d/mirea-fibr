import { getProductById as dbGetProductById, updateProduct as dbUpdateProduct } from "../db.js";
import { Request, Response } from "express";

export function updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = dbGetProductById(id as string);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, category, description, price, amount, rating, photo } = req.body;

    dbUpdateProduct(id as string, { name, category, description, price, amount, rating, photo });

    return res.status(200).json({ message: "Product updated" });
}
