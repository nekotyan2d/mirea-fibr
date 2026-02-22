import { getProductById as dbGetProductById, deleteProduct as dbDeleteProduct } from "../db.js";
import { Request, Response } from "express";

export function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = dbGetProductById(id as string);

    // проверяем, найден ли товар
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // удаляем
    dbDeleteProduct(id as string);

    return res.status(200).json({ message: "Product was successfully deleted" });
}
