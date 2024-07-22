import PrimeVue, { type PrimeVueConfiguration } from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Sidebar from 'primevue/sidebar'
import Menu from 'primevue/menu'
import Ripple from 'primevue/ripple'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Breadcrumb from 'primevue/breadcrumb'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import InputNumber from 'primevue/inputnumber'
import InputMask from 'primevue/inputmask'
import Skeleton from 'primevue/skeleton'
import Textarea from 'primevue/textarea'
import Tooltip from 'primevue/tooltip'
import RadioButton from 'primevue/radiobutton';
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true } as PrimeVueConfiguration)
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)
  nuxtApp.vueApp.directive('ripple', Ripple)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Sidebar', Sidebar)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('Menu  ', Menu)
  nuxtApp.vueApp.component('DataTable', DataTable)
  nuxtApp.vueApp.component('Column', Column)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Breadcrumb', Breadcrumb)
  nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog)
  nuxtApp.vueApp.component('InputNumber', InputNumber)
  nuxtApp.vueApp.component('InputMask', InputMask)
  nuxtApp.vueApp.component('Skeleton', Skeleton)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('RadioButton', RadioButton)

  // other components that you need
})
