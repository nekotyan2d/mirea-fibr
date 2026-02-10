import express from "express";

const app = express();

app.use(express.json());

const goods = [
    {
        id: 1,
        name: "Проходка на остров",
        price: 1000,
    },
];
//GET /goods - получить список всех товаров
app.get("/goods", (req, res) => {
    res.json(goods);
});

//GET /goods/:id - получить товар по id
app.get("/goods/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const good = goods.find((good) => good.id === id);

    if (good) {
        res.json(good);
    } else {
        res.status(404).json({ error: "Товар не найден" });
    }
});

//POST /goods - создать новый товар
app.post("/goods", (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: "Имя и цена обязательны" });
    }

    const newGood = {
        id: goods.length + 1,
        name,
        price,
    };
    goods.push(newGood);
    res.status(201).json(newGood);
});

//PUT /goods/:id - редактировать товар по id
app.put("/goods/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const good = goods.find((good) => good.id === id);

    if (good) {
        const { name, price } = req.body;
        if (name) good.name = name;
        if (price) good.price = price;
        res.json(good);
    } else {
        res.status(404).json({ error: "Товар не найден" });
    }
});

//DELETE /goods/:id - удалить товар по id
app.delete("/goods/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = goods.findIndex((good) => good.id === id);

    if (index !== -1) {
        goods.splice(index, 1);
        res.json({ message: "Товар удален" });
    } else {
        res.status(404).json({ error: "Товар не найден" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
