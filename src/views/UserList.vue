<template>
    <div class="container-fluid">
        <h6 class="mb-3">アカウント</h6>

        <div class="d-flex justify-content-between gap-3 mb-3">
            <input class="form-control w-25" v-model="keyword" placeholder="検索">
            <Button type="button" variant="primary" @click="createUser">新規作成</Button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <td :class="orderBy('code')" @click="sortBy('code')" role="button">アカウント</td>
                    <td :class="orderBy('name')" @click="sortBy('name')" role="button">名前</td>
                    <td :class="orderBy('role')" @click="sortBy('role')" role="button">ロール</td>
                    <td :class="orderBy('expiryDate')" @click="sortBy('expiryDate')" role="button">有効期限</td>
                    <td :class="orderBy('isActive')" @click="sortBy('isActive')" role="button">状態</td>
                    <td :class="orderBy('createdAt')" @click="sortBy('createdAt')" role="button">作成日時</td>
                    <td :class="orderBy('createdBy')" @click="sortBy('createdBy')" role="button">作成者</td>
                    <td :class="orderBy('updatedAt')" @click="sortBy('updatedAt')" role="button">更新日時</td>
                    <td :class="orderBy('updatedBy')" @click="sortBy('updatedBy')" role="button">更新者</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedData" :key="user.code">
                    <td>{{ user.code }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ roleLabel(user.role) }}</td>
                    <td>{{ formatDate(user.expiryDate) }}</td>
                    <td>{{ user.isActive ? '有効' : '無効' }}</td>
                    <td>{{ formatAt(user.createdAt) }}</td>
                    <td>{{ user.createdBy }}</td>
                    <td>{{ formatAt(user.updatedAt) }}</td>
                    <td>{{ user.updatedBy }}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-3">
                            <Button v-if="hasPermission('users:update')" type="button" variant="link" class="p-0" @click="updateUser(user)">編集</Button>
                            <Button v-if="hasPermission('users:remove')" type="button" variant="link" class="p-0" @click="removeUser(user)">削除</Button>
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

const users = ref([]);
const { keyword, page, pageLength, paginatedData, sortBy, orderBy } = useDataTable(users, 10);

const roleMap = {
    admin: 'Admin',
    user: 'User',
    guest: 'Guest',
};

const roleLabel = (role) => {
    return roleMap[role] ?? '';
};

const fetchUsers = async () => {
    try {
        startLoading();
        const response = await api.get('/api/users');
        users.value = response.data;
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const createUser = () => {
    routerState.setQuery({ ...route.query });
    router.push({
        name: 'UserCreate',
    });
};

const updateUser = ({ code }) => {
    routerState.setQuery({ ...route.query });
    router.push({
        name: 'UserUpdate',
        params: { code },
    });
};

const removeUser = async ({ code }) => {
    const isConfirmed = await confirm('削除しますか？');
    if (!isConfirmed) return;

    try {
        startLoading();
        await api.delete(`/api/users/${code}`);
        await fetchUsers();
        addToast('削除しました', 'success');
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

onMounted(() => {
    fetchUsers();
});
</script>