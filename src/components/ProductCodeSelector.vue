<template>
    <teleport to="body">
        <div v-if="props.isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <Button type="button" variant="close" @click="emit('close')"></Button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-3">
                                    <form @submit.prevent="search" autocomplete="off">
                                        <div class="mb-3">
                                            <input class="form-control" type="text" v-model="form.productCode" placeholder="品名コード">
                                        </div>
                                        <div class="mb-3">
                                            <input class="form-control" type="text" v-model="form.productName" placeholder="品名">
                                        </div>
                                        <div class="d-grid">
                                            <Button type="submit" variant="primary" :isAsync="isAsync" :disabled="isLoading">検索</Button>
                                        </div>
                                        <Message :error="errorMessage?.error" />
                                    </form>
                                </div>
                                <div class="col-9">
                                    <table class="table table-bordered table-hover">
                                        <thead class="table-secondary">
                                            <tr>
                                                <td :class="orderBy('productCode')" @click="sortBy('productCode')">品名コード</td>
                                                <td :class="orderBy('productName')" @click="sortBy('productName')">品名</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in paginatedData" :key="item.productCode">
                                                <td class="text-start">{{ item.productCode }}</td>
                                                <td class="text-start">{{ item.productName }}</td>
                                                <td class="text-start">
                                                    <div class="d-flex justify-content-center">
                                                        <Button type="button" variant="link" class="p-0" @click="select(item)">選択</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <Pagination
                                        v-model:page="page"
                                        :pageLength="pageLength"
                                    />
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
import { ref } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useAsync } from '@/composables/useAsync';
import { useDataTable } from '@/composables/useDataTable';
import { api } from '@/services/api';
import Button from '@/components/Button.vue';
import Message from '@/components/Message.vue';
import Pagination from '@/components/Pagination.vue';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['select', 'close']);
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsync, execute } = useAsync();

const items = ref([]);
const { page, pageLength, paginatedData, sortBy, orderBy } = useDataTable(items, 10);

const errorMessage = ref({});
const formRestore = () => ({
    productCode: '',
    productName: '',
});
const form = ref(formRestore());

const search = async () => {
    errorMessage.value.error = '';
    if (!form.value.productCode && !form.value.productName) {
        errorMessage.value.error = '検索条件を指定してください';
        return;
    }

    try {
        startLoading();
        await execute(async () => {
            const response = await api.get(`/api/products/search`, { params: form.value });
            items.value = response.data;
        });
    } catch (error) {
        errorMessage.value.error = error.message;
    } finally {
        stopLoading();
    }
};

const select = (item) => {
    emit('select', item);
    emit('close');
};
</script>