import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                email: string;
            };
        }
    }
}

const app = express();

app.use(cors());

app.use(express.json());

const JWT_SECRET = "mysupersecretjwtkey";

const JWT_EXPIRES_IN = "1h";

const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API auth",
            version: "1.0.0",
            description: "Простое API для изучения авторизации",
        },
        servers: [
            {
                url: "http://localhost:3000",
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
    apis: ["./index.ts"],
});

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
interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор
 *         title:
 *           type: string
 *           description: Название
 *         category:
 *           type: string
 *           description: Категория.
 *         description:
 *           type: string
 *           description: Описание.
 *         price:
 *           type: number
 *           description: Цена.
 *       required:
 *         - id
 *         - title
 *         - category
 *         - description
 *         - price
 */
interface Product {
    id: string;
    title: string;
    category: string;
    description: string;
    price: number;
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authorization = req.headers.authorization || "";

    const [scheme, token] = authorization.split(" ");

    if (scheme != "Bearer" || !token) {
        return res.status(401).json({
            message: "Missing or invalid Authorization header",
        });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = payload as any;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const users: User[] = [];
const products: Product[] = [
    {
        id: nanoid(6),
        title: "Комп 4 гига 4 ядра игровая видеокарта",
        description: "Ультрамегамощный современный компьютер",
        category: "pc",
        price: 29999,
    },
];

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     description: Получение информации о текущем пользователе
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                    $ref: '#/components/schemas/User'
 */
app.get("/api/me", authMiddleware, (req, res) => {
    const userId = req.user!.sub;
    const user = users.find((u) => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        },
    });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Регистрирует нового пользователя.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Почта
 *               first_name:
 *                 type: string
 *                 description: Имя
 *               last_name:
 *                 type: string
 *                 description: Фамилия
 *               password:
 *                 type: string
 *                 description: Пароль
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: token
 */
app.post("/api/auth/register", (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const newUser: User = {
        id: nanoid(6),
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: bcrypt.hashSync(password, 10),
    };

    users.push(newUser);

    const token = jwt.sign(
        {
            sub: newUser.id,
            email: newUser.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    res.json({ token: token });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     description: Позволяет пользователю войти в систему.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Почта
 *               password:
 *                 type: string
 *                 description: Пароль
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Пользователь успешно вошел в систему
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пользователь успешно вошел в систему
 */
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(401).json({ message: "Почта или пароль неверны" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Почта или пароль неверны" });
    }

    const token = jwt.sign(
        {
            sub: user.id,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    res.json({ token: token });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создание товара
 *     description: Создание товара
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название
 *               category:
 *                 type: string
 *                 description: Категория
 *               description:
 *                 type: string
 *                 description: Цена
 *             required:
 *               - title
 *               - category
 *               - description
 *               - price
 *     responses:
 *       400:
 *         description: Ошибка валидации
 *       200:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 */
app.post("/api/products", (req, res) => {
    const { title, category, description, price } = req.body;

    if (!title || !category || !description || !price) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const newProduct: Product = {
        id: nanoid(6),
        title,
        category,
        description,
        price,
    };
    products.push(newProduct);
    res.json({ product: newProduct });
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получение списка товаров
 *     description: Получение списка товаров
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Успешно
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
app.get("/api/products", (req, res) => {
    res.json({ products: products });
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получение товара по ID
 *     description: Получение товара по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID товара обязателен для заполнения" });
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
    }

    res.json({ product: product });
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Изменение товара
 *     description: Изменение товара
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название
 *               category:
 *                 type: string
 *                 description: Категория
 *               description:
 *                 type: string
 *                 description: Описание
 *               price:
 *                 type: number
 *                 description: Цена
 *             required:
 *               - title
 *               - category
 *               - description
 *               - price
 *     responses:
 *       400:
 *         description: Ошибка валидации
 *       200:
 *         description: Товар изменен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 */
app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID товара обязателен для заполнения" });
    }

    const { title, category, description, price } = req.body;
    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
    }

    product.title = title;
    product.category = category;
    product.description = description;
    product.price = price;

    res.json({ product: product });
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаление товара по ID
 *     description: Удаление товара по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар удален
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID товара обязателен для заполнения" });
    }

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Товар не найден" });
    }

    products.splice(productIndex, 1);
    res.json({ message: "Товар удален" });
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
