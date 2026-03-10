import { Product, ProductBody, User } from "./types/app.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { config } from "./config.js";

// хранилище
const products: Product[] = [
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 1000,
        rating: 4,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 100,
        rating: 2,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 1000,
        rating: 1,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 999,
        amount: 10,
        rating: 5,
        photo: "/images/cat.jpg",
    },
    {
        id: nanoid(6),
        name: "Кот в прайме",
        category: "cats",
        description: "Кот в прайме",
        price: 10000,
        amount: 1000,
        rating: 1,
        photo: "/images/cat.jpg",
    },
];

export function createProduct(data: Product) {
    products.push(data);
}

export function getProducts() {
    return products;
}

export function getProductById(id: string) {
    return products.find((product) => product.id === id);
}

export function updateProduct(id: string, data: ProductBody) {
    const i = products.findIndex((product) => product.id === id);

    // заменяем, либо оставляем старое значение
    products[i] = {
        name: data.name || products[i].name,
        category: data.category || products[i].category,
        description: data.description || products[i].description,
        price: data.price || products[i].price,
        amount: data.amount || products[i].amount,
        rating: data.rating || products[i].rating,
        photo: data.photo || products[i].photo,
        id: id,
    };
}

export function deleteProduct(id: string) {
    const i = products.findIndex((product) => product.id === id);

    if (i == -1) return;

    products.splice(i, 1);
}

const users: User[] = [];

export const getUsers = () => users;

export function createUser(data: User) {
    users.push(data);
}

export function getUserById(id: string): User | undefined {
    return users.find((user) => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
    return users.find((user) => user.email === email);
}

const refreshTokens = new Set<String>();

export function generateAccessToken(user: User) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
        },
        config.ACCESS_SECRET,
        {
            expiresIn: config.ACCESS_EXPIRES_IN,
        },
    );
}
export function generateRefreshToken(user: User) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
        },
        config.ACCESS_REFRESH_SECRET,
        {
            expiresIn: config.ACCESS_REFRESH_EXPIRES_IN,
        },
    );
}

export function addRefreshToken(token: string) {
    refreshTokens.add(token);
}

export function refreshTokenExists(token: string) {
    return refreshTokens.has(token);
}

export function removeRefreshToken(token: string) {
    refreshTokens.delete(token);
}
