import type { Product } from "../../../shared/types/app";
import "./ProductItem.scss";
import { api } from "../../api";

interface Props {
    data: Product;
    onDelete: () => void;
}

export default function ProductItem(props: Props) {
    async function deleteProduct() {
        try {
            const data = await api.deleteProduct(props.data.id);
            props.onDelete();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="product">
            <img
                src={props.data.photo}
                alt=""
                className="product__photo"
            />
            <div className="product__texts">
                <h2 className="product__title">{props.data.name}</h2>
                <div className="product__id">#{props.data.id}</div>
                <p className="product__description">{props.data.description}</p>
                <div className="product__price">
                    <span className="product__price-val">{props.data.price}</span>
                    <span>₽</span>
                </div>
            </div>
            <div className="product__right-content">
                <div className="product__actions">
                    <button className="product__edit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                            />
                        </svg>
                    </button>
                    <button
                        className="product__delete"
                        onClick={() => deleteProduct()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                            />
                        </svg>
                    </button>
                </div>
                <div className="product__stats">
                    <div className="product__amount">{props.data.amount} шт</div>
                </div>
            </div>
        </div>
    );
}
