import { getProducts as dbGetProducts } from "../db.js";
import { Request, Response } from "express";

export function getProducts(req: Request, res: Response) {
    return res.status(200).json({ products: dbGetProducts() });
}
