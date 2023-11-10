<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useFindPageContaApi, useRemoveContaApi } from "@/service/conta.api";

const route = useRouter();
const toast = useToast();
const findPageApi = useFindPageContaApi();
const removeApi = useRemoveContaApi();
const fakeMovimentacoes = [{}, {}, {}, {}, {}];
const search = ref("");

onMounted(() => {
  findPageApi.doFetch(0, 5, "");
});

function rowClick(event: any) {
  route.push({ name: "list-movimentacao", params: { id: event.data.id } });
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
  <Card>
    <template #header>
      <Toolbar>
        <template #start>
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="search"
              placeholder="Search"
              class="shadow-1 mr-2"
            />
          </span>
          <Button
            label="Refresh"
            icon="pi pi-refresh"
            class="p-button-raised"
            :loading="false"
            @click="refresh()"
          />
        </template>
      </Toolbar>
    </template>
    <template #content>
      <div v-if="findPageApi.error.value">
        <p>Oops! Error encountered: {{ findPageApi.error.value?.message }}</p>
      </div>
      <div v-else-if="findPageApi.processing.value">
        <DataTable
          show-gridlines
          striped-rows
          :value="fakeMovimentacoes"
          :rowHover="true"
          @row-click="rowClick($event)"
        >
          <Column
            field="id"
            header="Id"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="correntista"
            header="Correntista"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="numero"
            header="Numero"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="agencia"
            header="Agencia"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            header="Actions"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
        </DataTable>
      </div>
      <div v-else-if="findPageApi.page.value?.content">
        <DataTable
          show-gridlines
          striped-rows
          :value="findPageApi.page.value.content"
          :rowHover="true"
          @row-click="rowClick($event)"
        >
          <Column
            field="id"
            header="Id"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: left"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.id }}
              </div>
            </template>
          </Column>
          <Column
            field="correntista"
            header="Correntista"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: left"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.correntista.nome }}
              </div>
            </template>
          </Column>
          <Column
            field="numero"
            header="Numero"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: left"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.numero }}
              </div>
            </template>
          </Column>
          <Column
            field="agencia"
            header="Agencia"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: left"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.agencia }}
              </div>
            </template>
          </Column>
          <Column
            header="Actions"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div style="text-align: center">
                <Button
                  icon="pi pi-trash"
                  class="p-button-danger p-button-text p-button-sm p-0"
                  v-tooltip.left="'Remove'"
                  :loading="isRemoving(slotProps.data.id)"
                  @click="removeConta(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <Paginator
        :rows="findPageApi.page.value?.size"
        :totalRecords="findPageApi.page.value?.totalElements"
        :rowsPerPageOptions="[5, 10, 20, 30]"
        @page="onPage($event)"
      />
    </template>
  </Card>
</template>
