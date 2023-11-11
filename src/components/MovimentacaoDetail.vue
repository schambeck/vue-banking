<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCreateMovimentacaoApi, useFindByIdMovimentacaoApi } from "@/service/movimentacao.api";

const route = useRoute();
const createApi = useCreateMovimentacaoApi();
const findByIdApi = useFindByIdMovimentacaoApi();
const movimentacao = ref();

onMounted(() => {
  if (route.params.id === "") {
    movimentacao.value = {};
  } else {
    const id = parseInt(route.params.id.toString());
    findByIdApi
      .doFetch(id)
      .then(() => (movimentacao.value = findByIdApi.entity.value));
  }
});
</script>

<style scoped>
::v-deep(.p-card-body) {
  padding: 1rem;
}
::v-deep(.p-card-content) {
  padding: 0;
}
::v-deep(.p-toolbar .p-button) {
  margin: 0.2rem;
}
</style>

<template>
  <Card>
    <template #header>
      <Toolbar>
        <template #start>
          <router-link to="/list-conta" custom v-slot="{ navigate }">
            <Button
              v-tooltip="'Back to the movimentacao list'"
              label="Back"
              icon="pi pi-arrow-left"
              class="p-button-secondary p-button-raised mr-2"
              role="link"
              @click="navigate"
            />
          </router-link>
        </template>
      </Toolbar>
    </template>
    <template #content>
      <div v-if="createApi.error.value">
        <div v-if="Array.isArray(createApi.error.value.message)">
          <Message
            severity="error"
            v-for="message in createApi.error.value.message"
            :key="message"
          >
            {{ message }}
          </Message>
        </div>
        <Message severity="error" v-else>
          <p>{{ createApi.error.value.message }}</p>
        </Message>
      </div>
      <div v-else-if="findByIdApi.processing.value">
        <div class="field">
          <label for="id">Id</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="data">Data</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="tipo">Tipo</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="valor">Valor</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="saldoAnterior">Saldo Ant</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
      </div>
      <div v-if="movimentacao" v-focus-trap>
        <div class="field">
          <label for="id" class="w-full">Id</label>
          <InputNumber input-id="id" v-model="movimentacao.id" disabled />
        </div>
        <div class="field">
          <label for="data" class="w-full">Data</label>
          <Calendar
            inputId="data"
            v-model="movimentacao.data"
            :manual-input="false"
            date-format="yy-mm-dd"
            disabled
          />
        </div>
        <div class="field">
          <label for="tipo" class="w-full">Tipo</label>
          <InputText id="tipo" type="text" v-model="movimentacao.tipo" disabled />
        </div>
        <div class="field">
          <label for="valor" class="w-full">Valor</label>
          <InputNumber
            input-id="valor"
            v-model="movimentacao.valor"
            mode="decimal"
            locale="pt-BR"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            disabled
          />
        </div>
        <div class="field">
          <label for="saldoAnterior" class="w-full">Saldo Ant</label>
          <InputNumber
            input-id="saldoAnterior"
            v-model="movimentacao.saldoAnterior"
            mode="decimal"
            locale="pt-BR"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            disabled
          />
        </div>
      </div>
    </template>
  </Card>
</template>
