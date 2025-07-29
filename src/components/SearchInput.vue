<template>
    <div class="position-relative">
        <input
            type="text"
            v-bind="attrs"
            :class="classes"
            :value="modelValue"
            :readonly="props.readonly"
            @input="emit('update:modelValue', $event.target.value)"
            @change="emit('change')"
        >
        <button v-if="!props.readonly"
            type="button"
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y"
            tabindex="-1"
            @click="emit('open')"
        >
            <i class="bi bi-search"></i>
        </button>
    </div>
</template>

<script setup>
defineOptions({
    inheritAttrs: false
});
import { computed, useAttrs } from 'vue';

const props = defineProps({
    modelValue: String,
    readonly: Boolean,
});
const emit = defineEmits(['update:modelValue', 'change', 'open']);
const attrs = useAttrs();

const classes = computed(() => {
    const classList = ['form-control', 'pe-5'];

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