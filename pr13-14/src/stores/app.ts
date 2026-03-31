import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Todo } from "../types/app";

export const useAppStore = defineStore("app", () => {
    const todoList = ref<Todo[]>(
        JSON.parse(
            localStorage.getItem("todoList") ||
                JSON.stringify([
                    { id: 1, text: "Learn Vue", createdAt: Date.now() },
                    { id: 2, text: "Build something awesome", createdAt: Date.now() },
                ]),
        ),
    );

    watch(
        todoList,
        () => {
            localStorage.setItem("todoList", JSON.stringify(todoList.value));
        },
        { deep: true },
    );

    function addTodo(text: string) {
        todoList.value.push({
            id: todoList.value.length,
            text: text,
            isCompleted: false,
            createdAt: new Date().getTime(),
        });
    }

    function removeTodo(id: number) {
        const index = todoList.value.findIndex((item) => item.id === id);
        if (index !== -1) {
            todoList.value.splice(index, 1);
        }
    }

    function toggleTodoCompleted(id: number) {
        const index = todoList.value.findIndex((item) => item.id === id);
        if (index !== -1) {
            todoList.value[index]!.isCompleted = !todoList.value[index]!.isCompleted;
        }
    }

    return {
        todoList,
        addTodo,
        removeTodo,
        toggleTodoCompleted,
    };
});
