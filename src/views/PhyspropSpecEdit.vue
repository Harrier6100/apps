<template>
    <div class="container">
        <h6 class="mb-3">物性規格マスタ</h6>

        <form @submit.prevent="save" autocomplete="off">

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="productCode">品名コード</label>
                <div class="col-9">
                    <ProductCodeInput
                        id="productCode"
                        v-model="physpropSpec.productCode"
                        @change="productCodeSelect"
                        @error="err => {
                            errors.productCode = err
                            errorMessage.productCode = err?.message
                        }"
                    />
                    <Message :error="errorMessage?.productCode" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="productName">品名</label>
                <div class="col-9">
                    <input class="form-control" type="text" id="productName" v-model="physpropSpec.productName" readonly>
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="customerCode">得意先コード</label>
                <div class="col-9">
                    <CustomerCodeInput
                        id="customerCode"
                        v-model="physpropSpec.customerCode"
                        @change="customerCodeSelect"
                        @error="err => {
                            errors.customerCode = err
                            errorMessage.customerCode = err?.message
                        }"
                    />
                    <Message :error="errorMessage?.customerCode" />
                </div>
            </div>

            <div class="row mb-3">
                <label class="col-3 col-form-label" for="customerName">得意先名</label>
                <div class="col-9">
                    <input class="form-control" type="text" id="customerName" v-model="physpropSpec.customerName" readonly>
                </div>
            </div>

            <table class="table table-bordered">
                <thead class="table-secondary">
                    <tr>
                        <td>物性コード</td>
                        <td>物性名</td>
                        <td>規格値</td>
                        <td>単位</td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <button type="button" tabindex="-1" @click="propertySpecs.add(propertySpec)">追加</Button>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(spec, index) in physpropSpec.specs" :key="index">
                        <td>
                            <PhyspropCodeInput
                                v-model="spec.propertyCode"
                                @change="item => propertyCodeSelect(index, item)"
                                @error="err => {
                                    spec.error = err
                                    spec.errorMessage = err?.message
                                }"
                            />
                            <Message :error="spec?.errorMessage" />
                        </td>
                        <td>
                            <input class="form-control" type="text" v-model="spec.propertyName" readonly>
                        </td>
                        <td>
                            <div class="d-flex gap-1">
                                <input class="form-control" type="text" v-model="spec.values[0]">
                                <input class="form-control" type="text" v-model="spec.values[1]">
                                <input class="form-control" type="text" v-model="spec.values[2]">
                                <input class="form-control" type="text" v-model="spec.values[3]">
                                <input class="form-control" type="text" v-model="spec.values[4]">
                            </div>
                        </td>
                        <td>
                            <input class="form-control" type="text" v-model="spec.uom" readonly>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center gap-1">
                                <button type="button" tabindex="-1" @click="propertySpecEdit(index, spec)"></button>
                                <button type="button" tabindex="-1" @click="propertySpecs.push(index, propertySpec)">挿</button>
                                <button type="button" tabindex="-1" @click="propertySpecs.up(index)">↑</button>
                                <button type="button" tabindex="-1" @click="propertySpecs.down(index)">↓</button>
                                <button type="button" tabindex="-1" @click="propertySpecs.remove(index)">削</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-end gap-3">
                <Button type="button" variant="secondary" :disabled="isLoading" @click="back">キャンセル</Button>
                <Button type="submit" variant="primary" :isAsync="isAsync" :disabled="isLoading">保存</Button>
            </div>

        </form>
    </div>

    <PropertySpecModal
        v-if="propertySpecModal.isOpen.value"
        :isOpen="propertySpecModal.isOpen.value"
        :modelValue="propertySpecItem.item"
        @close="propertySpecModal.close"
        @save="propertySpecSave"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useAsync } from '@/composables/useAsync';
import { useArray } from '@/composables/useArray';
import { useToggle } from '@/composables/useToggle';
import { api } from '@/services/api';
import Button from '@/components/Button.vue';
import Message from '@/components/Message.vue';
import ProductCodeInput from '@/components/ProductCodeInput.vue';
import CustomerCodeInput from '@/components/CustomerCodeInput.vue';
import PhyspropCodeInput from '@/components/PhyspropCodeInput.vue';
import PropertySpecModal from '@/components/PropertySpecModal.vue';

const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsync, execute } = useAsync();
const propertySpecModal = useToggle();

const errors = ref({});
const errorMessage = ref({});

const propertySpecs = useArray();
const propertySpec = {
    propertyCode: '',
    propertyName: '',
    values: new Array(5),
    uom: '',
    uomSi: '',
    numberSize: 0,
    decimalScale: 0,
    isTrancate: false,
    isRequired: true,
    isActive: true,
};
const physpropSpecRestore = () => ({
    productCode: '',
    productName: '',
    customerCode: '',
    customerName: '',
    specs: propertySpecs.items,
    remarks: '',
});
const physpropSpec = ref(physpropSpecRestore());
const propertySpecItem = ref({});

const productCodeSelect = (item) => {
    physpropSpec.value.productName = item?.productName ?? '';
};

const customerCodeSelect = (item) => {
    physpropSpec.value.customerName = item?.customerName ?? '';
};

const propertyCodeSelect = (index, item) => {
    physpropSpec.value.specs[index].propertyName = item?.name ?? '';
    physpropSpec.value.specs[index].propertyName = (item?.name ?? '') + (item?.adherendName ?? '');
    physpropSpec.value.specs[index].uom = item?.uom ?? '';
};

const propertySpecEdit = (index, item) => {
    propertySpecItem.value.item = { ...item };
    propertySpecItem.value.index = index;
    propertySpecModal.open();
};

const propertySpecSave = (item) => {
};

const back = () => {
};
</script>