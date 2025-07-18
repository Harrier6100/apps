<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <div class="container-fluid">
            <BaseButton variant="link" @click="sidebar.open">
                <span class="navbar-toggler-icon"></span>
            </BaseButton>
            <div class="me-auto">
                <router-link class="navbar-brand" to="/">Brand</router-link>
            </div>

            <UserAuth />
        </div>
    </nav>

    <Sidebar
        :isOpen="sidebar.isOpen.value"
        @close="sidebar.close"
    />
</template>

<script setup>
import { useToggle } from '@/composables/useToggle';
import BaseButton from '@/components/BaseButton.vue';
import UserAuth from '@/components/UserAuth.vue';
import Sidebar from '@/components/Sidebar.vue';
const sidebar = useToggle();
</script>