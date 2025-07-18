<template>
    <div class="d-flex justify-content-between gap-3 mb-3">
        <input
            class="form-control w-25"
            placeholder="検索"
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"
        />
        <BaseButton v-if="isShowButton"
            variant="primary"
            @click="emit('buttonClick')"
        >
            {{ buttonLabel }}
        </BaseButton>
    </div>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
    modelValue: String,
    isShowButton: Boolean,
    buttonLabel: {
        type: String,
        default: '追加',
    },
});
const emit = defineEmits(['update:modelValue', 'buttonClick']);
</script>