<template>
  <div>
    <Menu :model="items" class="shadow-4" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const items = ref([
  {
    label: "General",
    items: [
      {
        label: "Home",
        icon: "pi pi-home",
        to: "/",
      },
      {
        label: "Profile",
        icon: "pi pi-user",
        to: "/profile",
      },
    ],
  },
  {
    label: "Banking",
    items: [
      {
        label: "Saldo",
        icon: "pi pi-money-bill",
        to: "/list-saldo",
      },
      {
        label: "Extrato",
         icon: "pi pi-book",
        to: "/list-conta",
      },
    ],
  },
]);
</script>

<style scoped>
::v-deep(.p-menu) {
  border-radius: 12px !important;
}
::v-deep(.p-menu ul) {
  margin: 2px !important;
}
</style>
