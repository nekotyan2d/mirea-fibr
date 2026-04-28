import express from "express";

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.json({
        port: PORT,
    });
});

app.listen(+PORT!, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
