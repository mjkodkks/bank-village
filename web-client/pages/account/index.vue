<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import { getAccountListService } from '~/services/account'
import type { AccountTypeResponse } from '~/utils/account'
import { roles } from '~/utils/roles'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const toast = useToast()
const router = useRouter()
const dayjs = useDayjs()
const { strToCurrency } = useNumber()

function rowClick({ data }: any) {
  // console.log(data)
  const { id, userId } = data
  router.push({
    path: `/account/${id}`,
    query: {
      userId,
    },
  })
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const accounts = ref<AccountTypeResponse[] | null>()
const accountLoading = ref(false)
async function fetchAccounts() {
  accountLoading.value = true
  const { isSuccess, data, error } = await getAccountListService()
  if (isSuccess && data) {
    // console.log(data)
    accounts.value = data.map((m) => {
      return {
        ...m,
        firstname: m.owner?.firstname,
        username: m.owner?.username,
        surname: m.owner?.surname,
        typeTH: mapAccoutType(m.type).th,
        createdAt: dayjs(m.createdAt).format('DD/MM/YYYY HH:mm'),
      }
    })
    // console.log(accounts.value);
  }
  setTimeout(() => {
    accountLoading.value = false
  }, 500)
}

const accountCount = computed(() => accounts.value && accounts.value.length)

function init() {
  fetchAccounts()
}

init()
</script>

<template>
  <div class="h-[calc(100dvh_-_60px)] px-2 md:px-6 xl:px-8 py-4 flex flex-col">
    <h1 class="my-0">บัญชี / รวมบัญชีทั้งหมด</h1>
    <div>
      <hr class="border-gray-200 border border-solid" />
    </div>
    <div class="header flex gap-2 mt-4">
      <div class="flex justify-content-end">
        <IconField icon-position="left">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters.global.value"
            placeholder="ค้นหาบัญชีที่นี้"
          />
        </IconField>
      </div>
      <!-- <div class="ml-auto">
                <Button
                    @click="isCreateUserDialogVisible = true"
                    icon="pi pi-user-plus"
                    label="เพิ่มสมาชิก"
                ></Button>
            </div> -->
    </div>
    <div v-if="accounts" class="mt-4">จำนวนบัญชี ({{ accountCount }})</div>
    <div class="table-wrapper mt-4 flex-1 overflow-hidden">
      <template v-if="!accountLoading">
        <DataTable
          v-model:filters="filters"
          :value="accounts"
          striped-rows
          scrollable
          scroll-height="flex"
          class="p-datatable-sm text-sm"
          table-style="min-width: 50rem"
          :global-filter-fields="[
            'name',
            'id',
            'type',
            'typeTH',
            'balance',
            'interest',
            'username',
            'firstname',
            'surname',
          ]"
          selection-mode="single"
          @row-click="rowClick"
        >
          <Column field="id" header="เลขที่บัญชี">
            <template #body="{ data }">
              <span class="underline text-primary hover:text-pink-600">{{
                data.id || "-"
              }}</span>
            </template>
          </Column>
          <Column field="typeTH" header="ประเภท" />
          <Column field="balance" header="ยอดสุทธิ (บาท)">
            <template #body="{ data }">
              {{ strToCurrency(data.balance) || "0" }}
            </template>
          </Column>
          <Column field="interest" header="ดอกเบี้ย (บาท)" />
          <Column field="owner" header="เจ้าของบัญชี">
            <template #body="{ data }">
              {{ data.owner?.username ? `(${data.owner?.username}) ` : "" }}
              {{ data.owner?.firstname || "" }}
              {{ data.owner?.surname || "" }}
            </template>
          </Column>
          <Column field="createdAt" header="เริ่มใช้งาน" />
        </DataTable>
      </template>
      <template v-else>
        <TableLoading :cols="7" :rows="8" />
      </template>
    </div>
  </div>
</template>
