import { useEffect, useState } from "react";
import CreateProductModal from "../../components/CreateProductModal/CreateProductModal";
import ProductsList from "../../components/ProductsList/ProductsList";
import "./ProductsPage.scss";
import type { Product } from "../../types/app.js";
import { api } from "../../api";
import EditProductModal from "../../components/EditProductModal/EditProductModal";

export default function ProductsPage() {
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    function onCreateButtonClick() {
        setShowCreateProductModal(true);
    }

    function onCreateProduct(product: Product) {
        setProducts((prevProducts) => [...prevProducts, product]);
    }

    function onEditProduct(id: string) {
        // находим товар и открываем модалку
        setSelectedProduct(products.findIndex((product) => product.id === id));
        setShowEditProductModal(true);
    }

    function onDeleteProduct(id: string) {
        // удаляем товар
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    }

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

    return (
        <div className="page">
            <header className="page-header">
                <h1>КОТЗОН</h1>
                <button onClick={onCreateButtonClick}>Создать</button>
            </header>
            <ProductsList
                products={products}
                onDelete={onDeleteProduct}
                onEdit={onEditProduct}
            />
            {showCreateProductModal && (
                <CreateProductModal
                    onClose={() => setShowCreateProductModal(false)}
                    onCreate={onCreateProduct}
                />
            )}
            {showEditProductModal && (
                <EditProductModal
                    product={products[selectedProduct!]}
                    onClose={() => setShowEditProductModal(false)}
                    onUpdate={(updatedProduct) => {
                        setProducts((prevProducts) =>
                            prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
                        );
                    }}
                />
            )}
        </div>
    );
}
