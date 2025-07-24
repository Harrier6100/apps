<template>
    <template v-if="isAuth">
        <button class="btn btn-primary" type="button" @click="logout">
            <i class="bi bi-person-circle me-1"></i>{{ name }}
        </button>
    </template>
    <template v-else>
        <button class="btn btn-primary" type="button" @click="loginModal.open">ログイン</button>
    </template>

    <LoginModal
        v-if="loginModal.isOpen.value"
        :isOpen="loginModal.isOpen.value"
        @close="loginModal.close"
    />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useUser } from '@/composables/useUser';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { useToggle } from '@/composables/useToggle';
import LoginModal from '@/components/LoginModal.vue';

const router = useRouter();
const { isAuth, authLogout } = useAuth();
const { name } = useUser();
const { confirm } = useConfirm();
const { addToast } = useToast();
const loginModal = useToggle();

const logout = async () => {
    const isConfirmed = await confirm('ログアウトしますか？');
    if (!isConfirmed) return;

    try {
        await authLogout();
        router.push('/');
        addToast('ログアウトしました。', 'success');
    } catch (error) {
        console.error(error);
        addToast('ログアウトできませんでした。', 'error');
    }
};
</script>