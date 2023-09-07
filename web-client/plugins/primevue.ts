import { defineNuxtPlugin } from "#app";
import PrimeVue, { PrimeVueConfiguration } from "primevue/config";
import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import Password from "primevue/password";
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true } as PrimeVueConfiguration);
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("Password", Password);
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.component('Toast', Toast)
    //other components that you need
});