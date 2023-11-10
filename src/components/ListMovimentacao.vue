<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import moment from "moment/moment";
import {
  API_URL,
  useFindPageMovimentacaoApi,
  useRemoveMovimentacaoApi,
} from "@/service/movimentacao.api";
import type { Conta } from "@/entity/conta.entity";
import {
  useFindByIdContaApi,
  useFindContaByNumeroAndAgencia,
  useFindPageContaApi
} from "@/service/conta.api";
import type { Correntista } from "@/entity/correntista.entity";
import { useFindByIdSaldoApi } from "@/service/saldo.api";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const findPageContaApi = useFindPageContaApi();
const findContaByNumeroAndAgenciaApi = useFindContaByNumeroAndAgencia();
const findPageApi = useFindPageMovimentacaoApi();
const findByIdContaApi = useFindByIdContaApi();
const removeApi = useRemoveMovimentacaoApi();
const fakeMovimentacoes = [{}, {}, {}, {}, {}];
const search = ref("");
const conta = ref();
const contas = ref<Conta[]>();
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
  console.log(`doSearchConta`);
  if (conta.value?.id) {
    findPageApi.apiUrl = `${API_URL}/extrato/${conta.value.id}`;
    await findPageApi.doFetch(0, 5, conta.value.id.toString());
  }
}

async function doSearchContaById(id: number) {
  console.log(`doSearchContaById: ${id}`);
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

async function doSearchContaNumeroAgencia() {
  console.log(`doSearchContaNumeroAgencia: ${numeroConta?.value}/${agenciaConta?.value}`);
  if (numeroConta?.value && agenciaConta?.value) {
    await findContaByNumeroAndAgenciaApi
      .doFetch(numeroConta.value, agenciaConta.value)
      .then(() => {
        conta.value = findContaByNumeroAndAgenciaApi.entity.value;
        correntista.value = conta.value.correntista;
      });
  }
}

// watch(numeroConta, doSearchContaNumeroAgencia);
// watch(agenciaConta, doSearchContaNumeroAgencia);

onMounted(() => {
  if (route.params?.id === "") {
    // saldo.value = {};
  } else {
    const id = parseInt(route.params?.id.toString());
    doSearchContaById(id);
    // doSearchConta();
  }
});

function searchConta(event: any) {
  console.log(`searchConta: ${event.query}`);
  findPageContaApi.doFetch(0, 5, conta.value).then(() => {
    contas.value = findPageContaApi.page.value.content;
  });
}

function rowClick(event: any) {
  router.push({ name: "movimentacao-detail", params: { id: event.data.id } });
}

function removeMovimentacao(id: number) {
  removeApi.doFetch(id).then(() => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Movimentacao removed: ${id}`,
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

function newMovimentacao() {
  router.push({ name: "movimentacao-detail", params: { id: null } });
}

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
<!--      <div class="field">-->
<!--        <label for="conta" class="mr-2">Conta</label>-->
<!--        <AutoComplete-->
<!--          id="conta"-->
<!--          v-model="conta"-->
<!--          loading-icon="null"-->
<!--          :suggestions="contas"-->
<!--          option-label="numero"-->
<!--          @complete="searchConta($event)"-->
<!--        >-->
<!--          <template #option="slotProps">-->
<!--            <div>-->
<!--              {{ slotProps.option.numero }} / {{ slotProps.option.agencia }} - -->
<!--              {{ slotProps.option.correntista.nome }}-->
<!--            </div>-->
<!--          </template>-->
<!--        </AutoComplete>-->
<!--      </div>-->
<!--      <Toolbar>-->
<!--        <template #start>-->
<!--        </template>-->
<!--        <template #end>-->
<!--        </template>-->
<!--      </Toolbar>-->
    </template>
    <template #content>
      <panel header="Conta" class="mb-2">
        <div class="field">
          <label for="numeroConta" class="mr-2">Número</label>
          <InputNumber input-id="numeroConta" v-model="numeroConta" disabled />
          <label for="agenciaConta" class="ml-2 mr-2">Agência</label>
          <InputText id="agenciaConta" type="text" v-model="agenciaConta" class="w-2" disabled />
          <label for="nomeCorrentista" class="ml-2 mr-2">Correntista</label>
          <InputText id="nomeCorrentista" type="text" v-model="correntista.nome" disabled />
        </div>
      </panel>
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
                {{ formatDecimal(slotProps.data.saldoAnterior) }}
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
                {{ formatDecimal(slotProps.data.valor) }}
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
                  @click="removeMovimentacao(slotProps.data.id)"
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
