<template>
    <BaseButton type="submit" :disabled="props.isLoading">
        <span v-if="props.isAsync" class="spinner-border spinner-border-sm me-1"></span>
        <slot></slot>
    </BaseButton>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
    isAsync: {
        type: Boolean,
        default: false,
    },
})
const emit = defineEmits([]);
</script>