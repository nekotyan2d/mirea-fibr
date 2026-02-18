import axios from "axios";

import type { Product, ProductBody } from "../shared/types/app";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

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
};
