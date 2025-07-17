<template>
    <BaseModal :isOpen="isOpen" @close="confirmNo">
        <p>{{ confirmMessage }}</p>
        <div class="d-flex justify-content-end gap-3">
            <BaseButton variant="secondary" @click="confirmNo">No</BaseButton>
            <BaseButton variant="primary" @click="confirmYes">Yes</BaseButton>
        </div>
    </BaseModal>
</template>

<script setup>
import { useConfirm } from '@/composables/useConfirm';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';

const { isOpen, confirmMessage, confirmYes, confirmNo } = useConfirm();
</script>