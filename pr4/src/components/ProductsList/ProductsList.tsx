import type { Product } from "../../../shared/types/app";
import ProductItem from "../ProductItem/ProductItem";
import "./ProductsList.scss";

interface Props {
    products: Product[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

export default function ProductsList(props: Props) {
    function onDelete(id: string) {
        props.onDelete(id);
    }

    return (
        <div className="products-list">
            {props.products.map((product) => (
                <ProductItem
                    data={product}
                    key={product.id}
                    onDelete={() => onDelete(product.id)}
                    onEdit={() => props.onEdit(product.id)}
                />
            ))}
        </div>
    );
}
