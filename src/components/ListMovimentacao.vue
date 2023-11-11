<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import moment from "moment/moment";
import { API_URL, useFindPageMovimentacaoApi, useRemoveMovimentacaoApi } from "@/service/movimentacao.api";
import { useFindByIdContaApi } from "@/service/conta.api";
import type { Correntista } from "@/entity/correntista.entity";

const route = useRoute();
const router = useRouter();
const findPageApi = useFindPageMovimentacaoApi();
const findByIdContaApi = useFindByIdContaApi();
const removeApi = useRemoveMovimentacaoApi();
const fakeMovimentacoes = [{}, {}, {}, {}, {}];
const search = ref("");
const conta = ref();
const numeroConta = ref<number>();
const agenciaConta = ref("");
const correntista = ref<Correntista>({
  id: 0,
  nome: "",
  cpf: "",
  email: "",
  version: 0,
});

async function doSearchConta() {
  if (conta.value?.id) {
    findPageApi.apiUrl = `${API_URL}/extrato/${conta.value.id}`;
    await findPageApi.doFetch(0, 5, conta.value.id.toString());
  }
}

async function doSearchContaById(id: number) {
  if (id) {
    await findByIdContaApi.doFetch(id).then(() => {
      conta.value = findByIdContaApi.entity.value;
      numeroConta.value = conta.value.numero;
      agenciaConta.value = conta.value.agencia;
      correntista.value = conta.value.correntista;
    });
  }
}

watch(conta, doSearchConta);

onMounted(() => {
  if (route.params?.id !== "") {
    const id = parseInt(route.params?.id.toString());
    doSearchContaById(id);
  }
});

function rowClick(event: any) {
  router.push({ name: "movimentacao-detail", params: { id: event.data.id } });
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

const formatDecimal = (value: string) => {
  if (value)
    return parseFloat(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
};

const formatDate = (value: string) => {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY");
  }
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
      <panel header="Conta" class="">
        <div class="field">
          <router-link to="/list-conta" custom v-slot="{ navigate }">
            <Button
              v-tooltip="'Back to the conta list'"
              icon="pi pi-arrow-left"
              class="p-button-secondary p-button-raised mr-2"
              role="link"
              @click="navigate"
            />
          </router-link>
          <Button
            icon="pi pi-refresh"
            class="p-button-raised mr-2"
            :loading="false"
            @click="refresh()"
          />
          <label for="numeroConta" class="mr-2">Número</label>
          <InputNumber input-id="numeroConta" v-model="numeroConta" disabled />
          <label for="agenciaConta" class="ml-2 mr-2">Agência</label>
          <InputText id="agenciaConta" type="text" v-model="agenciaConta" class="w-2" disabled />
          <label for="nomeCorrentista" class="ml-2 mr-2">Correntista</label>
          <InputText id="nomeCorrentista" type="text" v-model="correntista.nome" disabled />
        </div>
      </panel>
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
            field="data"
            header="Data"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="tipo"
            header="Tipo"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="saldoAnterior"
            header="Saldo Ant"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="valor"
            header="Valor"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body>
              <Skeleton height="1.1rem" />
            </template>
          </Column>
          <Column
            field="saldoAtual"
            header="Saldo"
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
          class="mt-2"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
              <h4 class="m-0">Movimentação</h4>
            </div>
          </template>
          <Column
            field="id"
            header="Id"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: right"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.id }}
              </div>
            </template>
          </Column>
          <Column
            field="data"
            header="Data"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: center"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ formatDate(slotProps.data.data) }}
              </div>
            </template>
          </Column>
          <Column
            field="tipo"
            header="Tipo"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ slotProps.data.tipo }}
              </div>
            </template>
          </Column>
          <Column
            field="saldoAnterior"
            header="Saldo Ant"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: right"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ formatDecimal(slotProps.data.saldoAnterior.toFixed(2)) }}
              </div>
            </template>
          </Column>
          <Column
            field="valor"
            header="Valor"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: right"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ formatDecimal(slotProps.data.valor.toFixed(2)) }}
              </div>
            </template>
          </Column>
          <Column
            field="saldoAtual"
            header="Saldo"
            headerStyle="width: 10%"
            class="cursor-pointer"
          >
            <template #body="slotProps">
              <div
                style="text-align: right"
                v-bind:class="{ 'line-through': isRemoving(slotProps.data.id) }"
              >
                {{ formatDecimal(slotProps.data.tipo === 'DEBITO' ? slotProps.data.saldoAnterior - slotProps.data.valor : slotProps.data.saldoAnterior + slotProps.data.valor) }}
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
