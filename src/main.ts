import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import Card from "primevue/card";
import Panel from "primevue/panel";
import Toolbar from "primevue/toolbar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import "./assets/main.css";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Menu from "primevue/menu";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import Divider from "primevue/divider";
import Steps from "primevue/steps";
import AutoComplete from "primevue/autocomplete";
import InputText from "primevue/inputtext";
import FocusTrap from "primevue/focustrap";
import Tooltip from "primevue/tooltip";
import InputNumber from "primevue/inputnumber";
import Paginator from "primevue/paginator";
import InlineMessage from "primevue/inlinemessage";
import Message from "primevue/message";
import Ripple from "primevue/ripple";
import ToastService from "primevue/toastservice";
import Calendar from "primevue/calendar";
import Breadcrumb from "primevue/breadcrumb";
import Keycloak from 'keycloak-js';

const app = createApp(App);

app.use(router);
app.use(ToastService);
app.use(PrimeVue, { ripple: true });
app.component("Toolbar", Toolbar);
app.component("Panel", Panel);
app.component("Card", Card);
app.component("Column", Column);
app.component("Menu", Menu);
app.component("Button", Button);
app.component("Skeleton", Skeleton);
app.component("Paginator", Paginator);
app.component("Message", Message);
app.component("Calendar", Calendar);
app.component("DataTable", DataTable);
app.component("Divider", Divider);
app.component("Steps", Steps);
app.component("Breadcrumb", Breadcrumb);
app.component("AutoComplete", AutoComplete);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber);
app.component("InlineMessage", InlineMessage);
app.directive("FocusTrap", FocusTrap);
app.directive("tooltip", Tooltip);
app.directive("ripple", Ripple);
app.mount("#app");

export const keycloak = new Keycloak({
  url: "http://keycloak.localhost:9000",
  realm: "banking",
  clientId: "vue-banking",
});

try {
  const authenticated = await keycloak.init({
    onLoad: "login-required",
  });
  console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
} catch (error) {
  console.error('Failed to initialize adapter:', error);
}
