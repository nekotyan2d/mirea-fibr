export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    amount: number;
    rating: number;
    photo: string;
}

export type ProductBody = Omit<Product, "id">;

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}
