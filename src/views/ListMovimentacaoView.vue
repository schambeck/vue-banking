<template>
  <panel class="shadow-4">
    <template #header>
      <Breadcrumb :home="home" :model="items" class="w-full" />
    </template>
    <template #default>
      <ListMovimentacao />
    </template>
  </panel>
</template>

<script setup lang="ts">
import ListMovimentacao from "@/components/ListMovimentacao.vue";
import { ref } from "vue";
const home = ref({
  icon: "pi pi-home",
});
const items = ref([
  { label: "Extrato" },
  { label: "Conta" },
  { label: "Movimentação" }
]);
</script>
