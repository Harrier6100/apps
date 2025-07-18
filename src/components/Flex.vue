<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const props = defineProps({
    justify: {
        type: String,
        default: 'start',
    },
    align: {
        type: String,
        default: 'stretch',
    },
    class: {
        type: String,
    },
});
const emit = defineEmits([]);
const attrs = useAttrs();

const classes = computed(() => {
    const classList = ['d-flex'];

    if (props.justify) {
        classList.push(`justify-content-${props.justify}`);
    }

    if (props.align) {
        classList.push(`align-items-${props.align}`);
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