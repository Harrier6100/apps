<template>
    <div class="container">
        <h6 class="mb-3">物性規格マスタ</h6>

        <form @submit.prevent="save" autocomplete="off">

            <div class="row">
                <div class="col">

                    <div class="row mb-3">
                        <label class="col-3 col-form-label" for="productCode">品名コード</label>
                        <ProductCodeInput
                            id="productCode"
                            v-model="physpropSpec.productCode"
                            @change="productCodeSelect"
                            @errorMessage="errorMessage.productCode = $event"
                            @error="errors.productCode = $event"
                        />
                        <Message :error="errorMessage.productCode" />
                    </div>

                </div>
            </div>

        </form>
    </div>
</template>