<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="emit('close')">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div v-if="close" class="modal-header">
                            <BaseButton variant="close" @click="emit('close')"></BaseButton>
                        </div>
                        <div class="modal-body">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
    isOpen: Boolean,
    close: Boolean,
});
const emit = defineEmits(['close']);
</script>