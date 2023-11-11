<template>
  <panel class="shadow-4">
    <template #header>
      <Breadcrumb :home="home" :model="items" class="w-full" />
    </template>
    <template #default>
      <ListConta />
    </template>
  </panel>
</template>

<script setup lang="ts">
import ListConta from "@/components/ListConta.vue";
import { ref } from "vue";

const home = ref({
  icon: "pi pi-home",
});
const items = ref([
  { label: "Extrato" },
  { label: "Conta" }
]);
</script>
