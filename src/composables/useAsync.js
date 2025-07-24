import { ref } from 'vue';

export const useAsync = () => {
    const isAsync = ref(false);

    const execute = async (Function) => {
        isAsync.value = true;

        try {
            const response = await Function();
            return response;
        } catch (error) {
            throw error;
        } finally {
            isAsync.value = false;
        }
    };

    return {
        isAsync,
        execute,
    };
};