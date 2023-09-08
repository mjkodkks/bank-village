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

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true } as PrimeVueConfiguration);
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("Password", Password);
    nuxtApp.vueApp.component("Sidebar", Sidebar);
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('Menu  ', Menu)
    nuxtApp.vueApp.directive('ripple', Ripple);
    
    //other components that you need
});