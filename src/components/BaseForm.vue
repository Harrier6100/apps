<template>
    <form @submit.prevent="emit('submit')" autocomplete="off">
        <slot></slot>
    </form>
</template>

<script setup>
const props = defineProps({
});
const emit = defineEmits(['submit']);
</script>