<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
        <div class="container-fluid">
            <BaseButton variant="link">
                <span class="navbar-toggler-icon"></span>
            </BaseButton>
            <div class="me-auto">
                <router-link class="navbar-brand" to="/">Brand</router-link>
            </div>

            <UserAuth />
        </div>
    </nav>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue';
import UserAuth from '@/components/UserAuth.vue';
</script>