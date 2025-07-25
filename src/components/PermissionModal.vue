<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="emit('close')">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <Button variant="close" @click="emit('close')"></Button>
                        </div>
                        <div class="modal-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <td>リソース</td>
                                        <td>閲覧</td>
                                        <td>作成</td>
                                        <td>更新</td>
                                        <td>削除</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(permissionAction, key) in permissionActions" :key="key">
                                        <td>{{ permissionAction.label }}</td>
                                        <td v-for="action in actions" :key="action">
                                            <input class="form-check-input" type="checkbox" :value="permissionAction.actions[action]" v-model="permissions">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="d-flex justify-content-end gap-3">
                                <Button variant="secondary" @click="emit('close')">キャンセル</Button>
                                <Button variant="primary" @click="save">保存</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { permissionActions } from '@/config/permissionActions';
import Button from '@/components/Button.vue';

const props = defineProps({
    isOpen: Boolean,
    modelValue: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['save', 'close']);
const permissions = ref([]);
const actions = ['read', 'create', 'update', 'remove'];

watch(() => props.modelValue, (val) => {
    if (Array.isArray(val)) {
        permissions.value = [...val];
    }
}, { immediate: true });

const save = () => {
    emit('save', permissions.value);
    emit('close');
};
</script>