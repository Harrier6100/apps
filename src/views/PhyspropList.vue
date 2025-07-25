<template>
    <div class="container-fluid">
        <h6 class="mb-3">物性マスタ</h6>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" v-model="keyword" placeholder="検索">
            <Button @click="createPhysprop">新規作成</Button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td :class="orderBy('code')" @click="sortBy('code')" role="button">アカウント</td>
                    <td :class="orderBy('name')" @click="sortBy('name')" role="button">名前</td>
                    <td :class="orderBy('uom')" @click="sortBy('uom')" role="button">単位</td>
                    <td :class="orderBy('uomSi')" @click="sortBy('uomSi')" role="button">SI単位</td>
                    <td :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">作成日時</td>
                    <td :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">作成者</td>
                    <td :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">更新日時</td>
                    <td :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">更新者</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="physprop in paginatedData" :key="physprop.code">
                    <td>{{ physprop.code }}</td>
                    <td>{{ physprop.name }}</td>
                    <td>{{ physprop.uom }}</td>
                    <td>{{ physprop.uomSi }}</td>
                    <td>{{ formatAt(physprop.createdAt) }}</td>
                    <td>{{ physprop.createdBy }}</td>
                    <td>{{ formatAt(physprop.updatedAt) }}</td>
                    <td>{{ physprop.updatedBy }}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-3">
                            <Button v-if="hasPermission('physprops:update')" variant="link" class="p-0" @click="updatePhysprop(physprop)">編集</Button>
                            <Button v-if="hasPermission('physprops:remove')" variant="link" class="p-0" @click="removePhysprop(physprop)">削除</Button>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRouterState } from '@/composables/useRouterState';
import { useUser } from '@/composables/useUser';
import { useLoading } from '@/composables/useLoading';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { useDataTable } from '@/composables/useDataTableQuery';
import { api } from '@/services/api';
import { formatDate, formatAt } from '@/utils/formatDateTime';
import Button from '@/components/Button.vue';
import Pagination from '@/components/Pagination.vue';

const route = useRoute();
const router = useRouter();
const routerState = useRouterState();
const { hasPermission } = useUser();
const { isLoading, startLoading, stopLoading } = useLoading();
const { confirm } = useConfirm();
const { addToast } = useToast();

const physprops = ref([]);
const { keyword, page, pageLength, paginatedData, sortBy, orderBy } = useDataTable(physprops, 10);

const fetchPhysprops = async () => {
    try {
        startLoading();
        const response = await api.get('/api/physprops');
        physprops.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const createPhysprop = () => {
    routerState.setQuery({ ...route.query });
    router.push({
        name: 'PhyspropCreate',
    });
};

const updatePhysprop = ({ code }) => {
    routerState.setQuery({ ...route.query });
    router.push({
        name: 'PhyspropUpdate',
        params: { code },
    });
};

const removePhysprop = async ({ code }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/physprops/${code}`);
        await fetchPhysprops();
        addToast('削除しました。', 'success');
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

onMounted(() => {
    fetchPhysprops();
});
</script>