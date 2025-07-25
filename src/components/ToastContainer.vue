<template>
    <teleport to="body">
        <div class="toast-container position-fixed start-0 bottom-0 p-3">
            <div v-for="toast in toasts"
                :key="toast.id"
                :class="['toast', 'align-items-center', 'text-white', 'bg-opacity-75', 'border-0', 'show', toast.color]"
                role="alert"
            >
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toast.message }}
                    </div>
                    <Button variant="close" class="btn-close-white m-auto me-2" @click="removeToast(toast.id)"></Button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast';
import Button from '@/components/Button.vue';
const { toasts, addToast, removeToast } = useToast();
</script>