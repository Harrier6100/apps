<template>
    <Navbar />
    <main>
        <router-view />
    </main>

    <ToastContainer />
    <ConfirmDialog />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
</script>