<template>
    <div v-if="isShow"
        :class="classes"
    >
        {{ message }}
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    success: String,
    error: String,
});
const emit = defineEmits([]);

const isShow = computed(() => {
    return props.success || props.error;
});

const message = computed(() => {
    return props.success || props.error;
});

const classes = computed(() => {
    return [
        'form-text',
        props.success && 'text-success',
        props.error && 'text-danger',
    ];
});
</script>