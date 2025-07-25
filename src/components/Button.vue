<template>
    <button
        :type="type"
        :class="classes"
        :disabled="disabled"
        @click="emit('click')"
    >
        <span v-if="isAsync"
            class="spinner-border spinner-border-sm me-1"
            role="status"
        ></span>
        <slot></slot>
    </button>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const attrs = useAttrs();
const props = defineProps({
    type: {
        type: String,
        default: 'button',
    },
    variant: {
        type: String,
        default: 'primary',
    },
    disabled: Boolean,
    isAsync: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['click']);

const classes = computed(() => {
    const classList = ['btn', 'text-decoration-none'];

    if (props.variant) {
        classList.push(`btn-${props.variant}`);
    }

    if (attrs.class) {
        if (Array.isArray(attrs.class)) {
            classList.push(...attrs.class);
        } else {
            classList.push(attrs.class);
        }
    }

    return classList;
});
</script>