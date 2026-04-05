<template>
    <main>
        <header>
            <h1>Todo</h1>
            <button
                class="notify"
                @click="togglePush">
                <svg
                    v-if="!isPushSubscribed"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M5 19q-.425 0-.712-.288T4 18t.288-.712T5 17h1v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h1q.425 0 .713.288T20 18t-.288.713T19 19zm7 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m-4-5h8v-7q0-1.65-1.175-2.825T12 6T9.175 7.175T8 10z" />
                </svg>
                <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M16.15 19H5q-.425 0-.712-.288T4 18t.288-.712T5 17h1v-7q0-.825.213-1.625T6.85 6.85l1.5 1.5q-.175.4-.262.813T8 10v7h6.2L2.1 4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275zM13.5 4.2q2 .5 3.25 2.112T18 10v2.75q0 .5-.312.75t-.688.25t-.687-.262t-.313-.763V10q0-1.65-1.175-2.825T12 6q-.4 0-.85.1t-.8.25q-.425.175-.837.075t-.638-.475q-.2-.325-.137-.687t.387-.538t.675-.3t.7-.225v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5zM12 22q-.75 0-1.338-.413t-.587-1.112q0-.2.163-.337T10.6 20h2.8q.2 0 .363.138t.162.337q0 .7-.587 1.113T12 22m.825-12.025" />
                </svg>
            </button>
        </header>

        <div class="add-todo">
            <input
                class="text"
                v-model="newTodo" />
            <button
                class="add"
                @click="onTodoAdd">
                Добавить
            </button>
        </div>

        <TodoList
            :todos="appStore.todoList"
            @delete="onTodoDelete"
            @complete="onTodoComplete" />
    </main>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import TodoList from "./components/TodoList.vue";
import { useAppStore } from "./stores/app";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const appStore = useAppStore();

const newTodo = ref("");
const socket = ref<Socket | null>(null);
const isPushSubscribed = ref(false);

onMounted(async () => {
    socket.value = io("http://localhost:3001", {
        transports: ["websocket"],
    });
    socket.value.on("newTask", (todo) => {
        appStore.addTodo(todo.text);
    });

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    isPushSubscribed.value = !!subscription;
});

function onTodoAdd() {
    if (newTodo.value.trim() === "") {
        return;
    }
    socket.value!.emit("newTask", { text: newTodo.value });
    newTodo.value = "";
}

function onTodoDelete(id: number) {
    appStore.removeTodo(id);
}

function onTodoComplete(id: number) {
    appStore.toggleTodoCompleted(id);
}

async function togglePush() {
    if (isPushSubscribed.value) {
        unsubscribeFromPush();
    } else {
        subscribeToPush();
    }
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function subscribeToPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                "BOJ8dl4pjye9K0rqUgLzNVWkHdRsLjcpewn3jw6-rHjF1B0OwFvNZy-wrl9ODeQpeLrnwwFn5d6Kzy3kreo2rz0",
            ),
        });
        await fetch("http://localhost:3001/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription),
        });

        isPushSubscribed.value = true;
    } catch (error) {
        console.error(error);
    }
}

async function unsubscribeFromPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            isPushSubscribed.value = false;
            return;
        }

        await fetch("http://localhost:3001/unsubscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription),
        });

        await subscription.unsubscribe();

        isPushSubscribed.value = false;
    } catch (error) {
        console.error(error);
    }
}
</script>

<style lang="scss">
@use "@/assets/scss/app";

header {
    display: flex;

    h1 {
        flex: 1;
    }

    .notify {
        background-color: transparent;
        border: none;
        color: #183a30;
    }
}

.add-todo {
    display: flex;
    gap: 16px;

    .text {
        flex: 1;
    }
}
</style>
