import express from "express";
import cors from "cors";

const app = express();

import { createProduct } from "./controllers/CreateProduct.js";
import { getProducts } from "./controllers/GetProducts.js";
import { getProductById } from "./controllers/GetProductById.js";
import { updateProduct } from "./controllers/UpdateProduct.js";
import { deleteProduct } from "./controllers/DeleteProduct.js";

const PORT = 3000;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.post("/api/products", createProduct);
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
app.patch("/api/products/:id", updateProduct);
app.delete("/api/products/:id", deleteProduct);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on localhost:${PORT}`);
});
