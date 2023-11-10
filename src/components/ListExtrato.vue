<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useFindPageContaApi, useRemoveContaApi } from "@/service/conta.api";
import ListConta from "@/components/ListConta.vue";

const route = useRouter();
const toast = useToast();
const findPageApi = useFindPageContaApi();
const removeApi = useRemoveContaApi();
const fakeMovimentacoes = [{}, {}, {}, {}, {}];
const search = ref("");
const active = ref(0);
const steps = ref([
  {
    label: 'Step 1'
  },
  {
    label: 'Step 2'
  },
  {
    label: 'Step 3'
  }
])

onMounted(() => {
  findPageApi.doFetch(0, 5, "");
});

function rowClick(event: any) {
  route.push({ name: "conta-detail", params: { id: event.data.id } });
}

function removeConta(id: number) {
  removeApi.doFetch(id).then(() => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Conta removed: ${id}`,
      life: 3000,
    });
    refresh();
  });
}

function isRemoving(id: number) {
  return removeApi.isRemoving(id);
}

function refresh() {
  findPageApi.doFetch(
    findPageApi.page.value?.number,
    findPageApi.page.value?.size,
    search.value
  );
}

async function doSearch() {
  await findPageApi.doFetch(0, 5, search.value);
}

watch(search, doSearch);

function newConta() {
  route.push({ name: "conta-detail", params: { id: null } });
}

const formatDecimal = (value: string) => {
  if (value)
    return parseFloat(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
};

function onPage(event: any) {
  findPageApi.doFetch(event.page, event.rows, search.value);
}
</script>

<style scoped>
::v-deep(.p-card-body) {
  padding: 0;
}
::v-deep(.p-card-content) {
  padding: 0;
}
::v-deep(.p-paginator) {
  background-color: unset;
  padding: 0;
}
::v-deep(.p-toolbar .p-button) {
  margin: 0.2rem;
}
</style>

<template>
  <div class="card">
    <Steps :model="steps" />
    <ListConta></ListConta>
  </div>
</template>
