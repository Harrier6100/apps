import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import { useUserStore } from '@/stores/useUserStore';

export const useAuthStore = defineStore('auth', () => {
    const isAuth = ref(false);

    const authLogin = async (credentials) => {
        try {
            const response = await api.post(`/api/auth/login`, credentials);
            const { token } = response.data;
            isAuth.value = true;
            localStorage.setItem('token', token);

            const userStore = useUserStore();
            await userStore.fetchUser();
        } catch (error) {
            throw error;
        }
    };

    const authAutoLogin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            isAuth.value = false;
            return;
        }

        try {
            const response = await api.post(`/api/auth/refresh`);
            const { token: newToken } = response.data;
            isAuth.value = true;
            localStorage.setItem('token', newToken);

            const userStore = useUserStore();
            await userStore.fetchUser();
        } catch (error) {
            await authLogout();
        }
    };

    const authLogout = async () => {
        await api.post(`/api/auth/logout`);
        isAuth.value = false;
        localStorage.removeItem('token');

        const userStore = useUserStore();
        userStore.clearUser();
    };

    return {
        isAuth,
        authLogin,
        authAutoLogin,
        authLogout,
    };
});