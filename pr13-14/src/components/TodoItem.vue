<template>
    <div class="todo-item">
        <p class="text">{{ props.data.text }}</p>
        <button
            class="delete"
            @click="emit('delete')">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" />
            </svg>
        </button>
    </div>
</template>
<script lang="ts" setup>
import type { Todo } from "../types/app";

const props = defineProps<{
    data: Todo;
}>();

const emit = defineEmits<{
    (event: "delete"): void;
}>();
</script>
<style lang="scss" scoped>
.todo-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid #c1c1c1;
    border-radius: 16px;

    .text {
        flex: 1;
    }

    .delete {
        background-color: transparent;
        color: red;
        border: none;
    }
}
</style>
