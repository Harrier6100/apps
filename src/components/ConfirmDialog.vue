<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block shwo" @click.self="emit('close')">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <p>{{ confirmMessage }}</p>
                            <div class="d-flex justify-content-end gap-3">
                                <Button variant="secondary" @click="confirmNo">No</Button>
                                <Button variant="primary" @click="confirmYes">Yes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useConfirm } from '@/composables/useConfirm';
import Button from '@/components/Button.vue';
const { isOpen, confirmMessage, confirmYes, confirmNo } = useConfirm();
</script>