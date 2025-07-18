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
    type: {
        type: String,
        default: 'button',
    },
    variant: {
        type: String,
        default: 'primary',
    },
    small: Boolean,
    disabled: Boolean,
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