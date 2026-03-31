<template>
    <main>
        <h1>Todo</h1>
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
import { ref } from "vue";
import TodoList from "./components/TodoList.vue";
import { useAppStore } from "./stores/app";

const appStore = useAppStore();

const newTodo = ref("");

function onTodoAdd() {
    if (newTodo.value.trim() === "") {
        return;
    }
    appStore.addTodo(newTodo.value);
    newTodo.value = "";
}

function onTodoDelete(id: number) {
    appStore.removeTodo(id);
}

function onTodoComplete(id: number) {
    appStore.toggleTodoCompleted(id);
}
</script>

<style lang="scss">
@use "@/assets/scss/app";

.add-todo {
    display: flex;
    gap: 16px;

    .text {
        flex: 1;
    }
}
</style>
