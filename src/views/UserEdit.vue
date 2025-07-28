<template>
    <div class="container">
        <h6 class="mb-3">アカウント</h6>

        <form @submit.prevent="save" autocomplete="off">

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="code">アカウント</label>
                <div class="col-9">
                    <input class="form-control" type="text" id="code" v-model="user.code">
                    <Message :error="errorMessage.code" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="name">名前</label>
                <div class="col-9">
                    <input class="form-control" type="text" id="name" v-model="user.name">
                    <Message :error="errorMessage.name" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label pt-0">ロール</label>
                <div class="col-9">
                    <div v-for="role in roles" :key="role.value" class="form-check">
                        <input class="form-check-input" type="radio" :id="role.value" :value="role.value" v-model="user.role">
                        <label class="form-check-label" :for="role.value">{{ role.label }}</label>
                    </div>
                </div>
            </div>

            <div class="row mb-3" v-if="user.role === 'user'">
                <div class="col-9 offset-3">
                    <Button type="button" variant="link" class="ps-0" @click="permission.open">アクセス権限を設定</Button>
                </div>
            </div>

            <div class="row mb-3" v-if="user.role === 'guest'">
                <label class="col-3 col-form-label" for="expiryDate">有効期限</label>
                <div class="col-9">
                    <DatePicker class="form-control" id="expiryDate" v-model="user.expiryDate" placeholder="YYYY-MM-DD" />
                    <Message :error="errorMessage.expiryDate" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="remarks">備考</label>
                <div class="col-9">
                    <textarea class="form-control" id="remarks" v-model="user.remarks"></textarea>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-9 offset-3">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="isActive" v-model="user.isActive">
                        <label class="form-check-label" for="isActive">{{ user.isActive ? '有効なアカウント' : '無効なアカウント' }}</label>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end gap-3">
                <Button type="button" variant="secondary" :disabled="isLoading" @click="back">キャンセル</Button>
                <Button type="submit" variant="primary" :isAsync="isAsync" :disabled="isLoading">保存</Button>
            </div>

        </form>
    </div>

    <PermissionModal v-if="permission.isOpen.value"
        :isOpen="permission.isOpen.value"
        :modelValue="user.permissions"
        @save="user.permissions = $event"
        @close="permission.close"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRouterState } from '@/composables/useRouterState';
import { useLoading } from '@/composables/useLoading';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import { useToggle } from '@/composables/useToggle';
import { api } from '@/services/api';
import Button from '@/components/Button.vue';
import Message from '@/components/Message.vue';
import DatePicker from '@/components/DatePicker.vue';
import PermissionModal from '@/components/PermissionModal.vue';

const route = useRoute();
const router = useRouter();
const routerState = useRouterState();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsync, execute } = useAsync();
const { addToast } = useToast();
const permission = useToggle();

const errorMessage = ref({});
const userRestore = () => ({
    code: '',
    name: '',
    role: 'user',
    permissions: [],
    expiryDate: '',
    remarks: '',
    isActive: true,
});
const user = ref(userRestore());

const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
];

const isUpdateMode = computed(() => {
    return !!route.params.code;
});

watch(() => user.value.role, (val) => {
    if (val !== 'guest') {
        user.value.expiryDate = '';
    }
});

const fetchUser = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/users/${route.params.code}`);
        user.value = { ...userRestore(), ...response.data };
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!user.value.code) {
        errorMessage.value.code = 'アカウントを入力してください';
        isValid = false;
    }

    errorMessage.value.name = '';
    if (!user.value.name) {
        errorMessage.value.name = '名前を入力してください';
        isValid = false;
    }

    errorMessage.value.expiryDate = '';
    if (user.value.role === 'guest' && !user.value.expiryDate) {
        errorMessage.value.expiryDate = '有効期限を設定してください';
        isValid = false;
    }

    return isValid;
};

const save = async () => {
    if (!validate()) {
        addToast('入力内容に誤りがあります', 'error');
        return;
    }

    try {
        startLoading();
        await execute(async () => {
            if (isUpdateMode.value) {
                await api.put(`/api/users/${route.params.code}`, user.value);
            } else {
                await api.post('/api/users', user.value);
            }
        });
        addToast('保存しました', 'success');
        back();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const back = () => {
    const routeQuery = routerState.getQuery();
    router.push({
        name: 'UserList',
        query: routeQuery ?? {},
    });
};

onMounted(() => {
    if (isUpdateMode.value) {
        fetchUser();
    }
});
</script>