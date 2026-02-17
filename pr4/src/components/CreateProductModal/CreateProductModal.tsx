import "./CreateProductModal.scss";

export default function CreateProductModal() {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2 className="modal__title">Добавление товара</h2>
                <form>
                    <label htmlFor="name"></label>
                    <input
                        type="text"
                        placeholder="Название"
                        name="name"
                        id="name"
                    />
                    <label htmlFor="description"></label>
                    <input
                        type="text"
                        placeholder="Описание"
                        name="description"
                        id="description"
                    />
                    <label htmlFor="name"></label>
                    <input
                        type="text"
                        placeholder="Название"
                        name="name"
                        id="name"
                    />
                </form>
            </div>
        </div>
    );
}
