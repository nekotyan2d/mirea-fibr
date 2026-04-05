import express from "express";
import webPush from "web-push";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

webPush.setVapidDetails(
    "mailto:admin@nekotyan2d.ru",
    "BOJ8dl4pjye9K0rqUgLzNVWkHdRsLjcpewn3jw6-rHjF1B0OwFvNZy-wrl9ODeQpeLrnwwFn5d6Kzy3kreo2rz0",
    "CEj7_j2chgUeD9qIP41ZTubn_DJv4XNGrQm6GuQs-hQ",
);

app.use(cors());
app.use(bodyParser.json());

const subscriptions = new Array();

const io = new Server(server);

interface Task {
    text: string;
}

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("newTask", (task: Task) => {
        io.emit("newTask", task);

        const payload = JSON.stringify({
            title: "Новая задача",
            body: task.text,
        });

        subscriptions.forEach((sub) => {
            console.log("Sending notification to:", sub.endpoint);
            webPush
                .sendNotification(sub, payload)
                .then(() => {
                    console.log("Notification sent successfully");
                })
                .catch((err) => console.error(err));
        });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
app.post("/subscribe", (req, res) => {
    console.log("New subscription:", req.body);
    subscriptions.push(req.body);
    return res.status(200).json({ message: "Подписка сохранена" });
});

app.post("/unsubscribe", (req, res) => {
    const { endpoint } = req.body;

    const index = subscriptions.findIndex((sub) => sub.endpoint == endpoint);
    if (index > -1) {
        subscriptions.splice(index, 1);

        return res.status(200).json({ message: "Подписка удалена" });
    }

    return res.status(400).json({ message: "Произошла ошибка" });
});

server.listen(3001, () => {
    console.log("Server is started");
});
