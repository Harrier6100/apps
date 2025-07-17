<template>
    <button
        :type="type"
        :class="classes"
        :disabled="disabled"
        @click="emit('click')"
    >
        <slot></slot>
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'button',
    },
    small: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['click']);

const classes = computed(() => {
    return [
        'btn',
        `btn-${props.variant}`,
        props.small && 'btn-sm',
    ];
});
</script>