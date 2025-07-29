<template>
    <SearchInput
        v-bind="attrs"
        v-model="inputValue"
        :readonly="readonly"
        @open="selector.open"
        @change="change"
    />

    <CustomerCodeSelector
        :isOpen="selector.isOpen.value"
        @select="select"
        @close="selector.close"
    />
</template>

<script setup>
import { ref, watch, useAttrs } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useToggle } from '@/composables/useToggle';
import { api } from '@/services/api';
import SearchInput from '@/components/SearchInput.vue';
import CustomerCodeSelector from '@/components/CustomerCodeSelector.vue';

const props = defineProps({
    modelValue: String,
    readonly: Boolean,
});
const emit = defineEmits(['update:modelValue', 'change', 'error']);
const attrs = useAttrs();

const { startLoading, stopLoading } = useLoading();
const selector = useToggle();
const inputValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
    inputValue.value = val;
});

watch(inputValue, (val) => {
    emit('update:modelValue', val);
});

const select = (item) => {
    inputValue.value = item.customerCode;
    emit('change', item);
    emit('error', null);
};

const change = async () => {
    emit('change', null);
    emit('error', null);
    if (!inputValue.value) return;

    try {
        startLoading();
        const response = await api.get(`/api/customers/${inputValue.value}`);
        emit('change', response.data);
        emit('error', null);
    } catch (error) {
        emit('change', null);
        emit('error', { message: error.message });
    } finally {
        stopLoading();
    }
};
</script>