<template>
    <BaseButton type="submit" :disabled="isLoading">
        <span v-if="isAsync" class="spinner-border spinner-border-sm me-1"></span>
        <slot></slot>
    </BaseButton>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
    isLoading: Boolean,
    isAsync: Boolean,
})
const emit = defineEmits([]);
</script>