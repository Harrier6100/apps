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
                                    <input class="form-control" type="text" v-model="keyword" placeholder="検索">
                                </div>
                                <div class="col-9">
                                    <table class="table table-bordered table-hover">
                                        <thead class="table-secondary">
                                            <tr>
                                                <td :class="orderBy('customerCode')" @click="sortBy('customerCode')">得意先コード</td>
                                                <td :class="orderBy('customerName')" @click="sortBy('customerName')">得意先名</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in paginatedData" :key="item.customerCode">
                                                <td class="text-start">{{ item.customerCode }}</td>
                                                <td class="text-start">{{ item.customerName }}</td>
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
import { ref, onMounted, watch } from 'vue';
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

const fetchPhysprops = async () => {
    try {
        const response = await api.get('/api/physprops');
        items.value = response.data;
    } catch (error) {
    } finally {
    }
};

const select = (item) => {
    emit('select', item);
    emit('close');
};

onMounted(() => {
    fetchPhysprops();
});
</script>