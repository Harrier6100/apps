<template>
    <div class="d-flex justify-content-end">
        <Button variant="link" :disabled="props.page === 1" @click="emit('update:page', props.page - 1)">
            <i class="bi bi-chevron-left"></i>
        </Button>
        <template v-for="(page, index) in pages" :key="page === '...' ? page + '-' + index : page">
            <Button v-if="page === '...'" variant="link" :disabled="true">...</Button>
            <Button v-if="page !== '...'" variant="link" :disabled="page === props.page" @click="emit('update:page', page)">{{ page }}</Button>
        </template>
        <Button variant="link" :disabled="props.page >= props.pageLength" @click="emit('update:page', props.page + 1)">
            <i class="bi bi-chevron-right"></i>
        </Button>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Button from '@/components/Button.vue';

const props = defineProps({
    page: {
        type: Number,
        default: 1,
    },
    pageLength: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits(['update:page']);

const pages = computed(() => {
    const page = props.page;
    const pageLength = props.pageLength;
    const pageList = [];

    if (pageLength <= 7) {
        for (let n=1; n<=pageLength; n++) {
            pageList.push(n);
        }
    } else if (page <= 4) {
        pageList.push(1, 2, 3, 4, 5, '...', pageLength);
    } else if (page >= pageLength - 3) {
        pageList.push(1, '...', pageLength - 4, pageLength - 3, pageLength - 2, pageLength - 1, pageLength);
    } else {
        pageList.push(1, '...', page - 1, page, page + 1, '...', pageLength);
    }

    return pageList;
});
</script>