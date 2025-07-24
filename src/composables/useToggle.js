import { ref, computed } from 'vue';

export const useToggle = () => {
    const isOpen = ref(false);

    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    return {
        isOpen,
        open,
        close,
        toggle,
    };
};