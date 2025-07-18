<template>
    <div class="container-fluid">
        <h6 class="mb-3">アカウント</h6>

        <SearchAndButton
            v-model="keyword"
            :isShowButton="permission.has()"
            buttonLabel="新規追加"
            @buttonClick="addUser"
        />

        <table class="table table-hover">
            <tbody>
                <tr v-for="user in paginatedData" :key="user.code">
                    <td>{{ user.code }}</td>
                    <td>{{ user.name }}</td>
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
import { useLoading } from '@/composables/useLoading';
import { usePermission } from '@/composables/usePermission';
import { useDataTable } from '@/composables/useDataTableQuery';
import { api } from '@/services/api';
import SearchAndButton from '@/components/SearchAndButton.vue';
import Pagination from '@/components/Pagination.vue';

const { isLoading, startLoading, stopLoading } = useLoading();
const permission = usePermission();

const users = ref([]);
const { keyword, page, pageLength, paginatedData, sortBy, orderBy } = useDataTable(users, 1);

onMounted(() => {
    fetchUsers();
});

const fetchUsers = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/users`);
        users.value = response.data;
    } catch (error) {
    } finally {
        stopLoading();
    }
};

const addUser = () => {
};
</script>