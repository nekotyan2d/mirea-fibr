import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

import { createProduct } from "./controllers/CreateProduct.js";
import { getProducts } from "./controllers/GetProducts.js";
import { getProductById } from "./controllers/GetProductById.js";
import { updateProduct } from "./controllers/UpdateProduct.js";
import { deleteProduct } from "./controllers/DeleteProduct.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
        swaggerJsDoc({
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "API интернет-магазина",
                    version: "1.0.0",
                    description: "Простое API для управления товарами",
                },
                servers: [
                    {
                        url: `http://localhost:${PORT}`,
                        description: "Локальный сервер",
                    },
                ],
            },
            apis: [`${__dirname}/app.ts`, `${__dirname}/controllers/*.ts`],
        }),
    ),
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - amount
 *         - rating
 *         - photo
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара
 *         amount:
 *           type: number
 *           description: Количество товара на складе
 *         rating:
 *           type: number
 *           description: Рейтинг товара
 *         photo:
 *           type: string
 *           description: URL фотографии товара
 *       example:
 *         id: "abc123"
 *         name: "Кот"
 *         category: "cats"
 *         description: "Милый кот"
 *         price: 1000
 *         amount: 10
 *         rating: 4
 *         photo: "/images/cat.jpg"
 */
app.post("/api/products", createProduct);
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
app.patch("/api/products/:id", updateProduct);
app.delete("/api/products/:id", deleteProduct);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on localhost:${PORT}`);
});
