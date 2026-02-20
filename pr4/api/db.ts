import { Product, ProductBody } from "./types/app.js";
import { nanoid } from "nanoid";

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
        amount: 1000,
        rating: 4,
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

    products.splice(i, 1);
}
