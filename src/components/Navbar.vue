<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <div class="container-fluid">
            <Button type="button" variant="link" @click="sidebar.open">
                <span class="navbar-toggler-icon"></span>
            </Button>
            <div class="me-auto">
                <router-link class="navbar-brand" to="/">Brand</router-link>
            </div>
            <Authentication />
        </div>
    </nav>

    <Sidebar v-if="sidebar.isOpen.value"
        :isOpen="sidebar.isOpen.value"
        @close="sidebar.close"
    />
</template>

<script setup>
import { useToggle } from '@/composables/useToggle';
import Authentication from '@/components/Authentication.vue';
import Button from '@/components/Button.vue';
import Sidebar from '@/components/Sidebar.vue';
const sidebar = useToggle();
</script>