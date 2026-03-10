import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

// products
import { createProduct } from "./controllers/products/CreateProduct.js";
import { getProducts } from "./controllers/products/GetProducts.js";
import { getProductById } from "./controllers/products/GetProductById.js";
import { updateProduct } from "./controllers/products/UpdateProduct.js";
import { deleteProduct } from "./controllers/products/DeleteProduct.js";

// users
import { getMe } from "./controllers/users/GetMe.js";

// auth
import { register } from "./controllers/auth/Register.js";
import { login } from "./controllers/auth/Login.js";

import { authMiddleware } from "./middleware/auth.js";
import { refresh } from "./controllers/auth/Refresh.js";

const PORT = 3000;

const __dirname = import.meta.dirname;

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
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    },
                },
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
            },
            apis: [
                `${__dirname}/app.ts`,
                `${__dirname}/controllers/**/*.ts`,
                `${__dirname}/app.js`,
                `${__dirname}/controllers/**/*.js`,
            ],
        }),
    ),
);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор
 *         email:
 *           type: string
 *           format: email
 *           description: Почта
 *         first_name:
 *           type: string
 *           description: Имя
 *         last_name:
 *           type: string
 *           description: Фамилия
 *         password:
 *           type: string
 *           description: Хэшированный пароль
 *       required:
 *         - id
 *         - email
 *         - first_name
 *         - last_name
 *         - password
 */

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

// products
app.post("/api/products", authMiddleware, createProduct);
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
app.patch("/api/products/:id", authMiddleware, updateProduct);
app.delete("/api/products/:id", authMiddleware, deleteProduct);

// users
app.get("/api/users/me", authMiddleware, getMe);

// auth
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/refresh", refresh);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on localhost:${PORT}`);
});
