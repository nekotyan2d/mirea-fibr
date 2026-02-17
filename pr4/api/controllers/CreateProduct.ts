import { createProduct as dbCreateProduct } from "../db.js";
import { Request, Response } from "express";
import { nanoid } from "nanoid";

export function createProduct(req: Request, res: Response) {
    const { name, category, description, price, amount, rating, photo } = req.body;

    const newProduct = {
        name,
        category,
        description,
        price,
        amount,
        rating,
        photo,
        id: nanoid(6),
    };

    dbCreateProduct(newProduct);

    return res.status(200).json({ message: "Product created" });
}
