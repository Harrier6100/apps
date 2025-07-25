<template>
    <div class="container">
        <h6 class="mb-3">物性マスタ</h6>

        <form @submit.prevent="save" autocomplete="off">

            <div class="row mb-3">
                <label class="col-2 col-form-label" for="code">物性コード</label>
                <div class="col-10">
                    <div class="d-flex d-flex-row gap-2">
                        <input v-for="(n, index) in 5" class="form-control" type="text" :id="index === 0 ? 'code' : ''" v-model="physprop.codes[index]" :readonly="isUpdateMode">
                    </div>
                    <Message :error="errorMessage.code" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-2 col-form-label" for="name">物性名</label>
                <div class="col-10">
                    <input class="form-control" type="text" id="name" v-model="physprop.name">
                    <Message :error="errorMessage.name" />
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-10 offset-2">
                    <table class="table table-bordered">
                        <thead class="table-secondary">
                            <tr>
                                <td>言語</td>
                                <td>物性名</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="localize in physprop.localizes" :key="localize.lang">
                                <td style="width: 20%"><input class="form-control" type="text" v-model="localize.lang" readonly></td>
                                <td style="width: 80%"><input class="form-control" type="text" v-model="localize.name"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-2 col-form-label" for="uom">単位</label>
                <div class="col-10">
                    <input class="form-control" type="text" id="uom" v-model="physprop.uom">
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-2 col-form-label" for="uomSi">SI単位</label>
                <div class="col-10">
                    <input class="form-control" type="text" id="uomSi" v-model="physprop.uomSi">
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-2 col-form-label" for="numberSize">ｎ数</label>
                <div class="col-10">
                    <input class="form-control" type="number" id="numberSize" v-model="physprop.numberSize">
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-2 col-form-label" for="remarks">備考</label>
                <div class="col-10">
                    <textarea class="form-control" v-model="physprop.remarks"></textarea>
                </div>
            </div>

            <div class="d-flex justify-content-end gap-3">
                <Button type="button" variant="secondary" :disabled="isLoading" @click="back">キャンセル</Button>
                <Button type="submit" variant="primary" :isAsync="isAsync" :disabled="isLoading">保存</Button>
            </div>

        </form>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRouterState } from '@/composables/useRouterState';
import { useLoading } from '@/composables/useLoading';
import { useAsync } from '@/composables/useAsync';
import { useToast } from '@/composables/useToast';
import { api } from '@/services/api';
import Button from '@/components/Button.vue';
import Message from '@/components/Message.vue';

const route = useRoute();
const router = useRouter();
const routerState = useRouterState();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsync, execute } = useAsync();
const { addToast } = useToast();

const errorMessage = ref({});
const physpropRestore = () => ({
    code: '',
    codes: new Array(5).fill(''),
    name: '',
    uom: '',
    uomSi: '',
    numberSize: 0,
    localizes: ['ja', 'en'].map((lang) => {
        return {
            lang: lang,
            name: '',
        }
    }),
    remarks: '',
});
const physprop = ref(physpropRestore());

const isUpdateMode = computed(() => {
    return !!route.params.code;
});

watch(() => physprop.value.codes, (newValue) => {
    newValue.forEach((code, i) => {
        physprop.value.codes[i] = code.toUpperCase();
    });
    if (newValue[0] === 'A') {
        physprop.value.code = newValue.slice(0, 4).join('_');
    } else {
        physprop.value.code = newValue.join('_');
    }
}, { deep: true });

const fetchPhysprop = async () => {
    try {
        startLoading();
        const response = await api.get(`/api/physprops/${route.params.code}`);
        physprop.value = { ...physpropRestore(), ...response.data };
        physprop.value.codes = physprop.value.code.split('_');
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!physprop.value.code) {
        errorMessage.value.code = '物性コードを入力してください。';
        isValid = false;
    }

    errorMessage.value.name = '';
    if (!physprop.value.name) {
        errorMessage.value.name = '物性名を入力してください。';
        isValid = false;
    }

    return isValid;
};

const save = async () => {
    if (!validate()) {
        addToast('入力内容に誤りがあります。', 'error');
        return;
    }

    try {
        startLoading();
        await execute(async () => {
            if (isUpdateMode.value) {
                await api.put(`/api/physprops/${route.params.code}`, physprop.value);
            } else {
                await api.post('/api/physprops', physprop.value);
                physprop.value = physpropRestore();
            }
        });
        addToast('保存しました。', 'success');
        back();
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const back = () => {
    const routeQuery = routerState.getQuery();
    router.push({
        name: 'PhyspropList',
        query: routeQuery ?? {},
    });
};

onMounted(() => {
    if (isUpdateMode.value) {
        fetchPhysprop();
    }
});
</script>