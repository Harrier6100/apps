<template>
    <BaseModal :isOpen="isOpen" @close="emit('close')">
        <BaseForm @submit="login">

            <div class="mb-3">
                <label class="form-label" for="code">アカウント</label>
                <input class="form-control" type="text" id="code" v-model="credentials.code">
                <Message :error="errorMessage.code" />
            </div>
            
            <div class="mb-3">
                <label class="form-label" for="password">パスワード</label>
                <input class="form-control" type="password" id="password" v-model="credentials.password">
                <Message :error="errorMessage.password" />
            </div>

            <div class="d-grid">
                <AsyncButton :isLoading="isLoading" :isAsync="isAsync">ログイン</AsyncButton>
            </div>
          
            <Message :error="errorMessage.error" />

        </BaseForm>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { useAsync } from '@/composables/useAsync';
import { useMessage } from '@/composables/useMessage';
import BaseModal from '@/components/BaseModal.vue';
import BaseForm from '@/components/BaseForm.vue';
import AsyncButton from '@/components/AsyncButton.vue';
import Message from '@/components/Message.vue';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);
const router = useRouter();
const { authLogin } = useAuth();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsync, execute } = useAsync();
const { errorMessage } = useMessage();

const credentialsRestore = () => ({
    code: '',
    password: '',
});
const credentials = ref(credentialsRestore());

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!credentials.value.code) {
        errorMessage.value.code = 'アカウントを入力してください。';
        isValid = false;
    }

    errorMessage.value.password = '';
    if (!credentials.value.password) {
        errorMessage.value.password = 'パスワードを入力してください。';
        isValid = false;
    }

    return isValid;
}

const login = async () => {
    if (!validate()) return;

    try {
        startLoading();
        await execute(async () => {
            await authLogin(credentials.value);
        });
        emit('close');

        const redirectTo = sessionStorage.getItem('redirectTo');
        if (redirectTo) {
            sessionStorage.removeItem('redirectTo');
            router.push(redirectTo);
        }
    } catch (error) {
        errorMessage.value.error = error.message;
    } finally {
        stopLoading();
    }
};
</script>