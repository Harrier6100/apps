<template>
    <teleport to="body">
        <div v-if="props.isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="emit('close')">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="row mb-3">
                                <label class="col-3 col-form-label">物性コード</label>
                                <div class="col-9">
                                    <input class="form-control" v-model="propertySpec.propertyCode">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    modelValue: Object,
});
const emit = defineEmits(['save', 'close']);

const propertySpecRestore = () => ({
    code: '',
    name: '',
});
const propertySpec = ref(propertySpecRestore());

watch(() => props.modelValue, (val) => {
    if (val) {
        Object.assign(propertySpec.value, val);
    }
}, { immediate: true });

const save = () => {
    emit('save', { ...propertySpec.value });
};
</script>