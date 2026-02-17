import { useEffect, useState } from "react";
import { api } from "../../api";
import type { Product } from "../../../shared/types/app";
import ProductItem from "../ProductItem/ProductItem";
import "./ProductsList.scss";

export default function ProductsList() {
    const [products, setProducts] = useState(new Array<Product>());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const data = await api.getProducts();
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function onDelete(id: string) {
        setProducts(products.filter((product) => product.id !== id));
    }

    return (
        <div className="products-list">
            {loading}
            {products.map((product) => (
                <ProductItem
                    data={product}
                    key={product.id}
                    onDelete={() => onDelete(product.id)}
                />
            ))}
        </div>
    );
}
