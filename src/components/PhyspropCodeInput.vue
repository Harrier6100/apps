<template>
    <SearchInput
        v-bind="attrs"
        v-model="inputValue"
        :readonly="readonly"
        @open="selector.open"
        @change="change"
    />

    <PhyspropCodeSelector
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
import { adherendNames } from '@/config/adherendNames';
import SearchInput from '@/components/SearchInput.vue';
import PhyspropCodeSelector from '@/components/PhyspropCodeSelector.vue';

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
    inputValue.value = item.code;
    emit('change', item);
    emit('error', null);
};

const change = async () => {
    emit('change', null);
    emit('error', null);
    if (!inputValue.value) return;

    let adherendName = '';
    const propertyCodes = inputValue.value.split('_');
    if (propertyCodes[0] === 'A' && propertyCodes[3]) {
        const result = adherendNames.find(item => item.code === propertyCodes[3]);
        if (result) adherendName = result.name;
        propertyCodes[3] = '';
    }
    if (propertyCodes[0] !== 'A' && propertyCodes[4]) {
        const result = adherendNames.find(item => item.code === propertyCodes[4]);
        if (result) adherendName = result.name;
        propertyCodes[4] = '';
    }
    const propertyCode = propertyCodes.join('_');
    if (!adherendName) {
        emit('update:modeValue', propertyCode);
    }

    try {
        startLoading();
        const response = await api.get(`/api/physprops/${propertyCode}`);
        emit('change', { ...response.data, adherendName });
        emit('error', null);
    } catch (error) {
        emit('change', null);
        emit('error', { message: error.message });
    } finally {
        stopLoading();
    }
};
</script>