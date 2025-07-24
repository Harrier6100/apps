<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="emit('close')">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="btn-close" type="button" @click="emit('close')"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="login" autocomplete="off">
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
                                    <button class="btn btn-primary" type="submit" :disabled="isLoading">
                                        <span v-if="isAsync" class="spinner-border spinner-border-sm me-1"></span>ログイン
                                    </button>
                                </div>
                            </form>
                            <Message :error="errorMessage.error" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useLoading } from '@/composables/useLoading';
import { useAsync } from '@/composables/useAsync';
import Message from '@/components/Message.vue';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);

const router = useRouter();
const { authLogin } = useAuth();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsync, execute } = useAsync();

const credentialsRestore = () => ({
    code: '',
    password: '',
});
const credentials = ref(credentialsRestore());
const errorMessage = ref({});

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
};

const login = async () => {
    if (!validate()) return;

    try {
        startLoading();
        await execute(async () => {
            await authLogin(credentials.value);
        });
        emit('close');

        const redirect = sessionStorage.getItem('redirect');
        if (redirect) {
            sessionStorage.removeItem('redirect');
            router.push(redirect);
        }
    } catch (error) {
        errorMessage.value.error = error.message;
    } finally {
        stopLoading();
    }
};
</script>