import { defineNuxtPlugin } from "#app";
import PrimeVue, { PrimeVueConfiguration } from "primevue/config";
import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import Password from "primevue/password";
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';
import Ripple from "primevue/ripple";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Dropdown from 'primevue/dropdown';
import Breadcrumb from 'primevue/breadcrumb';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true } as PrimeVueConfiguration);
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.directive('ripple', Ripple);
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("Password", Password);
    nuxtApp.vueApp.component("Sidebar", Sidebar);
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('Menu  ', Menu)
    nuxtApp.vueApp.component('DataTable', DataTable);
    nuxtApp.vueApp.component('Column', Column);
    nuxtApp.vueApp.component('Dialog', Dialog);
    nuxtApp.vueApp.component('Dropdown', Dropdown);
    nuxtApp.vueApp.component('Breadcrumb', Breadcrumb);
    
    //other components that you need
});