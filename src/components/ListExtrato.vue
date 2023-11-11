<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFindPageContaApi } from "@/service/conta.api";
import ListConta from "@/components/ListConta.vue";

const findPageApi = useFindPageContaApi();
const search = ref("");

onMounted(() => {
  findPageApi.doFetch(0, 5, "");
});

async function doSearch() {
  await findPageApi.doFetch(0, 5, search.value);
}

watch(search, doSearch);
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
    <ListConta />
  </div>
</template>
