import { useEffect, useState } from "react";
import CreateProductModal from "../../components/CreateProductModal/CreateProductModal";
import ProductsList from "../../components/ProductsList/ProductsList";
import "./ProductsPage.scss";
import type { Product } from "../../types/app.js";
import { api } from "../../api";
import EditProductModal from "../../components/EditProductModal/EditProductModal";
import { useAuth } from "../../context/AuthContext.js";
import AuthModal from "../../components/AuthModal/AuthModal.js";

export default function ProductsPage() {
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    const { isAuthenticated, user, logout } = useAuth();

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
                {!isAuthenticated && (
                    <button
                        className="sign-in"
                        onClick={() => setShowAuthModal(true)}>
                        Войти
                    </button>
                )}
                {isAuthenticated && (
                    <div className="user-info">
                        {user && (
                            <span className="user-name">
                                {user.first_name} {user.last_name}
                            </span>
                        )}
                        <div
                            className="logout"
                            onClick={logout}
                            title="Выйти">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </header>

            {isAuthenticated && (
                <button
                    className="add-product"
                    onClick={onCreateButtonClick}>
                    +
                </button>
            )}
            <ProductsList
                products={products}
                onDelete={onDeleteProduct}
                onEdit={onEditProduct}
            />
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
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
