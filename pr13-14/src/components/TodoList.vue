<template>
    <div class="todo-list">
        <TodoItem
            v-for="item in props.todos"
            :key="item.id"
            :data="item"
            @delete="emit('delete', item.id)"
            @complete="emit('complete', item.id)" />
    </div>
</template>
<script lang="ts" setup>
import type { Todo } from "../types/app";
import TodoItem from "./TodoItem.vue";

const props = defineProps<{
    todos: Todo[];
}>();

const emit = defineEmits<{
    (event: "delete", id: number): void;
    (event: "complete", id: number): void;
}>();
</script>
<style lang="scss" scoped>
.todo-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
