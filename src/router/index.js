import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes = [];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const { isAuth, authAutoLogin } = useAuth();

    if (!isAuth.value) {
        await authAutoLogin();
    }

    next();
});

export default router;