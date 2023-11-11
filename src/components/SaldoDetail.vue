<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCreateSaldoApi, useFindByIdSaldoApi } from "@/service/saldo.api";

const route = useRoute();
const createApi = useCreateSaldoApi();
const findByIdApi = useFindByIdSaldoApi();
const saldo = ref();

onMounted(() => {
  if (route.params.id === "") {
    saldo.value = {};
  } else {
    const id = parseInt(route.params.id.toString());
    findByIdApi
      .doFetch(id)
      .then(() => (saldo.value = findByIdApi.entity.value));
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
          <router-link to="/list-saldo" custom v-slot="{ navigate }">
            <Button
              v-tooltip="'Back to the saldo list'"
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
          <label for="conta">Conta</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
        <div class="field">
          <label for="valor">Valor</label>
          <Skeleton width="100%" height="2.2rem" />
        </div>
      </div>
      <div v-if="saldo" v-focus-trap>
        <div class="field">
          <label for="id" class="w-full">Id</label>
          <InputNumber input-id="id" v-model="saldo.id" disabled />
        </div>
        <div class="field">
          <label for="conta" class="w-full">Conta</label>
          <InputText id="conta" type="text" v-model="saldo.conta.numero" disabled />
          <InputText id="contaAgencia" type="text" v-model="saldo.conta.agencia" disabled />
        </div>
        <div class="field" style="margin-bottom: 0">
          <label for="valor" class="w-full">Valor</label>
          <InputNumber
            input-id="valor"
            v-model="saldo.valor"
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
