<template>
    <div class="todo-item">
        <button
            class="mark"
            @click="emit('complete')"
            :data-completed="props.data.isCompleted">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
            </svg>
        </button>
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
    (event: "complete"): void;
}>();
</script>
<style lang="scss" scoped>
.todo-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid #c1c1c1;
    border-radius: 16px;

    .mark {
        background-color: transparent;
        color: #757575;
        border: none;

        &[data-completed="true"] {
            color: green;
        }
    }

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
