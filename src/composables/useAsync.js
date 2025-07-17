import { ref } from 'vue';

export const useAsync = () => {
    const isAsync = ref(false);

    const execute = async (asyncFunction) => {
        isAsync.value = true;

        try {
            const res = await asyncFunction();
            return res;
        } catch (err) {
            throw err;
        } finally {
            isAsync.value = false;
        }
    };

    return {
        isAsync,
        execute,
    };
};