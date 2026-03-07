import axios from "axios";

import type { Product, ProductBody } from "./types/app.js";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    },
);

interface InfoResponse {
    message: string;
}

interface CreateProductResponse extends InfoResponse {
    product: Product;
}

export const api = {
    createProduct: async (product: ProductBody) => {
        let response = await apiClient.post<CreateProductResponse>("/products", product);
        return response.data;
    },
    getProducts: async () => {
        let response = await apiClient.get<{
            products: Product[];
        }>("/products");
        return response.data;
    },
    getProductById: async (id: string) => {
        let response = await apiClient.get<{
            product: Product;
        }>(`/products/${id}`);
        return response.data;
    },
    updateProduct: async (id: string, product: ProductBody) => {
        let response = await apiClient.patch<InfoResponse>(`/products/${id}`, product);
        return response.data;
    },
    deleteProduct: async (id: string) => {
        let response = await apiClient.delete<InfoResponse>(`/products/${id}`);
        return response.data;
    },

    login: async (email: string, password: string) => {
        let response = await apiClient.post<{
            token: string;
        }>("/auth/login", { email, password });
        return response.data;
    },
    register: async (email: string, password: string, firstName: string, lastName: string) => {
        let response = await apiClient.post<{
            token: string;
        }>("/auth/register", { email, password, first_name: firstName, last_name: lastName });
        return response.data;
    },

    getMe: async () => {
        let response = await apiClient.get<{
            user: {
                id: string;
                email: string;
                first_name: string;
                last_name: string;
            };
        }>("/users/me");
        return response.data;
    },
};
