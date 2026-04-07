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

interface Reminder {
    timeout: NodeJS.Timeout;
    text: string;
    time: number;
}

const reminders = new Map<number, Reminder>();

const io = new Server(server);

interface Task {
    text: string;
}

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("newReminder", (task: Task) => {
        const now = Date.now();
        const timeout = setTimeout(() => {
            const payload = JSON.stringify({
                title: "Напоминание!",
                body: task.text,
                actions: [
                    {
                        action: "snooze",
                        title: "Отложить на 1 минуту",
                    },
                ],
                data: {
                    reminderId: now,
                },
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

            setTimeout(() => {
                reminders.delete(now);
            }, 10000);
        }, 60000);
        reminders.set(now, {
            text: task.text,
            timeout: timeout,
            time: now + 60000,
        });
    });
    socket.on("newTask", (task: Task) => {
        io.emit("newTask", {
            text: task.text,
        });

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

app.post("/snooze", (req, res) => {
    const { reminderId } = req.body;
    console.log(reminderId);

    if (!reminders.has(reminderId)) {
        console.log("не найдено");
        return res.status(404).json({
            message: "Напоминание не найдено",
        });
    }

    const reminder = reminders.get(reminderId)!;

    console.log(reminder);

    clearTimeout(reminder.timeout);

    reminder.timeout = setTimeout(() => {
        const payload = JSON.stringify({
            title: "Напоминание!",
            body: reminder.text,
            actions: [
                {
                    action: "snooze",
                    title: "Отложить на 1 минуту",
                },
            ],
            data: {
                reminderId: reminderId,
            },
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

        setTimeout(() => {
            reminders.delete(reminderId);
        }, 10000);
    }, 60000);

    reminder.time = Date.now() + 60000;
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
