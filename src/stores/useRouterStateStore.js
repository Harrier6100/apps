import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouterStateStore = defineStore('routerState', () => {
    const routeQuery = ref({});

    const getQuery = () => {
        return routeQuery.value;
    };

    const setQuery = (query) => {
        routeQuery.value = query;
    };

    return {
        routeQuery,
        getQuery,
        setQuery,
    };
});