<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { useField, useForm } from 'vee-validate'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { getAccountProfileService, interestPerYearService, rollbackTransactionService, transactionDepositService, transactionInterestService, transactionWithdrawService } from '~/services/account'
import { type Transaction, mapMessageTransaction, mapTransactionType } from '~/utils/account'
import { getAdminListService } from '~/services/user'
import IconsDeposit from '~/components/icons/Deposit.vue'
import IconsWithdraw from '~/components/icons/Withdraw.vue'
import IconsInterset from '~/components/icons/Interest.vue'
import type { AdminList } from '~/utils/user'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})
const toast = useToast()
const confirm = useConfirm()
const dayjs = useDayjs()
const route = useRoute()
const router = useRouter()
const id = route.params.id
const userId = route.query.userId
const { strToCurrency } = useNumber()
const mainStore = useMainStore()

const breadcrumbItems = ref<MenuItem[]>([
  { label: 'สมาชิก', to: '/member', icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
  { label: `โปรไฟล์สมาชิก${userId ? ` (${userId})` : ''}`, to: `/member/${userId}`, icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
])

const { handleSubmit, resetForm } = useForm()

const { value: amount, errorMessage: amountErrorMessage, resetField: resetFieldAmount } = useField<number>('amount', toTypedSchema(z.number().nonnegative({
  message: 'ไม่สามารถใส่ค่าที่เป็นลบได้',
}).safe().min(0.01, {
  message: 'กรุณาใส่เงินที่มากกว่าหรือเท่ากับ 0.01 บาท เป็นอย่างน้อย',
})), {
  initialValue: 0,
})

const { value: staff, errorMessage: staffErrorMessage, resetField: resetFieldStaff } = useField<number | undefined>('staff', toTypedSchema(z.number().min(1, {
  message: 'กรุณาใส่ผู้ดำเนินการ',
})), {
  initialValue: undefined,
})

const { value: note, errorMessage: noteErrorMessage, resetField: resetFieldNote } = useField<string>('note', undefined, {
  initialValue: '',
})

const onSubmit = handleSubmit(async (values) => {
  // console.log(values)
  const { amount, staff, note } = values
  const userId = staff
  confirm.require({
    message: `ยืนยันการ (${headerDialog.value.th}) จำนวน ${amount} บาท`,
    header: 'ยืนยัน',
    acceptLabel: 'ใช่, ยืนยัน',
    rejectLabel: 'ไม่',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      transaction(+id, amount, dialogMode.value, userId, note, isLoan.value)
    },
  })
})

const loadingTransaction = ref(false)
async function transaction(accountId: number, amount: number, type: string, userId?: number, note?: string, isLoan?: boolean) {
  let transactionService
  let successMessage
  let errMessage
  let modeMessage

  if (type === 'WITHDRAWAL') {
    transactionService = transactionWithdrawService
  }
  else if (type === 'DEPOSIT') {
    transactionService = transactionDepositService
  }
  else if (type === 'INTEREST') {
    transactionService = transactionInterestService
  }

  if (transactionService) {
    modeMessage = mapTransactionType(type, { isLoan }).longTh
    successMessage = mapMessageTransaction(type, { isLoan }).successMessage
    errMessage = mapMessageTransaction(type, { isLoan }).errMessage

    loadingTransaction.value = true
    const { isSuccess, data, error } = await transactionService(accountId, amount, userId, note)
    if (isSuccess && data) {
      toast.add({ severity: 'success', summary: modeMessage, detail: successMessage, life: 5000 })
      console.log(data)
      init()
      isDialogVisible.value = false
      loadingTransaction.value = false
    }
    else {
      const err = (error as any).statusMessage
      toast.add({ severity: 'warn', summary: modeMessage, detail: `${errMessage}  system message: ${err}`, life: 8000 })
      loadingTransaction.value = false
    }
  }
}

const profile = ref<AccountDetails>()
async function getAccountProfile(id: number) {
  const { isSuccess, data, error } = await getAccountProfileService(id)
  if (isSuccess && data) {
    profile.value = {
      ...data,
      typeTH: mapAccoutType(data.type).th,
      createdAt: dayjs(data.createdAt).format('ddd DD MMMM YYYY เวลา HH:mm:ss'),
    }
    // eslint-disable-next-line ts/no-unused-expressions
    breadcrumbItems.value[2] || breadcrumbItems.value.push({ label: `บัญชี ${data.type} (${id})`, icon: 'pi pi-wallet', class: '[&_.p-menuitem-text]:ml-2' })
  }
  return data
}
const isLoan = computed(() => profile.value ? profile.value.type === 'LOAN' : false)

const transactions = ref<Transaction[]>([])
async function getTransactions(id: number) {
  const { isSuccess, data, error } = await getTransactionsService(id)
  if (isSuccess && data) {
    // console.log(data)
    const transactionLength = data.length
    transactions.value = data.map((m, i) => {
      return {
        ...m,
        runId: transactionLength - i,
        staff: typeof m.staff !== 'string' ? `${m.staff?.username ? `(${m.staff.username})` : ''}` : '',
        createdAt: dayjs(m.createdAt).format('DD MMM BBBB'),
        createdTime: dayjs(m.createdAt).format('HH:mm:ss'),
        actionTH: isLoan.value ? mapTransactionType(m.action, { isLoan: true }).th : mapTransactionType(m.action).th,
        icon: m.action === 'DEPOSIT' ? markRaw(IconsDeposit) : m.action === 'WITHDRAWAL' ? markRaw(IconsWithdraw) : m.action === 'INTEREST' ? markRaw(IconsInterset) : null,
        iconColor: isLoan.value ? mapTransactionType(m.action, { isLoan: true }).color : mapTransactionType(m.action).color,
      }
    })
  }

  return data
}

const sumOfInterests = ref('')
async function getInterestPerYear(id: number) {
  const { isSuccess, data, error } = await interestPerYearService(id)
  if (isSuccess && data) {
    const { sumOfInterest, transactions } = data
    sumOfInterests.value = sumOfInterest
  }

  return data
}

const adminList = ref<AdminList>([])
async function getAdminList() {
  const { isSuccess, data, error } = await getAdminListService()
  if (isSuccess && data) {
    adminList.value = data
  }

  return data
}

function findAdminById(id: number) {
  return adminList.value.find(f => f.id == id)
}

const { calInterestByType, init: interestInit } = useInterest()
const isCalIntresSuccess = ref(false)

const isDialogVisible = ref(false)
const dialogMode = ref<'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST'>('DEPOSIT')
const headerDialog = computed(() => {
  return isLoan.value ? mapTransactionType(dialogMode.value, { isLoan: true }) : mapTransactionType(dialogMode.value)
})
const templateWordMonth = ref(monthLists.thShort)
const templateWordMonthSelected = ref(mapNoToMonth(dayjs().month() + 1, 'thShort'))
const yearList = ref(getYear({ isBudda: true, limit: 20 }))
const templateWordYearSelected = ref(dayjs().year() + 543)
function openDialogTransaction(type: string) {
  isDialogVisible.value = true
  amount.value = 0
  staff.value = mainStore.id
  note.value = ''

  if (type === 'DEPOSIT') {
    dialogMode.value = 'DEPOSIT'
  }
  else if (type === 'WITHDRAWAL') {
    dialogMode.value = 'WITHDRAWAL'
  }
  else if (type === 'INTEREST') {
    dialogMode.value = 'INTEREST'
    isCalIntresSuccess.value = true
    if (profile.value?.balance) {
      amount.value = calInterestByType(+profile.value.balance, profile.value.type)
      setTimeout(() => {
        isCalIntresSuccess.value = false
      }, 4000)
    }
  }
}

function addTempalte(month: string, year: number) {
  note.value += `${month} ${year}`
}

async function rollback() {
  confirm.require({
    message: `ยืนยันการ (ย้อนรายการล่าสุด)\nเมื่อย้อนแล้วข้อมูลจะไม่สามารถกู้กลับมาได้อีก`,
    header: 'ยืนยัน',
    acceptLabel: 'ใช่, ยืนยัน',
    rejectLabel: 'ไม่',
    acceptClass: 'p-button-danger',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      const { isSuccess, data, error } = await rollbackTransactionService(+id)
      if (isSuccess && data) {
        toast.add({ severity: 'success', summary: 'การย้อนรายการ', detail: 'การย้อนรายการสำเร็จ', life: 5000 })
        console.info(data)
        init()
      }
      else {
        const err = (error as any).data.message
        toast.add({ severity: 'warn', summary: 'การย้อนรายการ', detail: `การย้อนรายการไม่สำเร็จ \n` + `system message : ${err}`, life: 8000 })
      }
    },
  })
}

async function init() {
  await getAccountProfile(+id)
  await getTransactions(+id)
  await getInterestPerYear(+id)
  interestInit()
  getAdminList()
}

init()
</script>

<template>
  <div class="px-8 py-4 h-[calc(100dvh_-_60px)] overflow-auto">
    <div class="max-w-lg">
      <Breadcrumb
        :model="breadcrumbItems"
        class="p-2"
      >
        <template #item="{ label, item, props }">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="text-primary underline decoration-1 hover:text-pink-600"
          >
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </NuxtLink>
          <template v-else>
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </template>
        </template>
      </Breadcrumb>
    </div>
    <h3 class="mt-4">
      ข้อมูลทั่วไป
    </h3>
    <div
      v-if="profile"
      class="grid max-w-6xl sm:grid-cols-3 gap-y-2 xl:gap-y-4"
    >
      <div>
        <label>จำนวนเงิน</label>
        <div
          id="detail_balance"
          class="tracking-[1.2px] font-bold"
        >
          {{ strToCurrency(profile.balance) || '' }}
        </div>
      </div>
      <div>
        <label>ประเภทบัญชี</label>
        <div
          id="detail_type"
          class="font-extralight"
        >
          {{ profile?.typeTH || '' }}
        </div>
      </div>
      <div>
        <label>เจ้าของบัญชี</label>
        <div
          id="detail_owner"
          class="font-extralight"
        >
          <div>รหัสสมาชิก <span class="font-normal">{{ userId }}</span> </div>
          {{ profile.owner?.username ? `(${profile.owner?.username})` : '' }}
          {{ profile.owner?.firstname || '' }} {{ profile.owner?.surname || '' }}
        </div>
      </div>
      <div>
        <label>สร้างเมื่อ</label>
        <div
          id="detail_created"
          class="font-extralight"
        >
          {{ profile.createdAt || '' }}
        </div>
      </div>
    </div>
    <div
      v-if="profile"
      class="flex gap-2 mt-4 2xl:mt-8"
    >
      <Button
        severity="success"
        icon="pi pi-angle-double-up"
        :label="isLoan ? 'ขอกู้' : 'ฝาก'"
        @click="() => openDialogTransaction('DEPOSIT')"
      >
        <template #icon>
          <IconsDeposit class="mr-2" />
        </template>
      </Button>
      <Button
        icon="pi pi-angle-double-down"
        :label="isLoan ? 'ชำระ' : 'ถอน'"
        @click="() => openDialogTransaction('WITHDRAWAL')"
      >
        <template #icon>
          <IconsWithdraw class="mr-2" />
        </template>
      </Button>
      <Button
        severity="warning"
        icon="pi pi-star"
        label="ดอกเบี้ย"
        @click="() => openDialogTransaction('INTEREST')"
      >
        <template #icon>
          <IconsInterest class="mr-2" />
        </template>
      </Button>
    </div>
    <div class="flex flex-col md:flex-row">
      <h3>บันทึกรายการธุรกรรม</h3>
      <div class="ml-auto flex items-center gap-2 mb-2 md:mb-0">
        <div
          v-if="sumOfInterests"
          class="border-[#655DBB] border-solid p-2 rounded-lg font-light"
        >
          <i class="pi pi-star text-yellow-400" />
          ดอกเบี้ยปีนี้ <span class="tracking-[1.2px] font-bold">{{ sumOfInterests }}</span> (บาท)
        </div>
        <div>
          <Button
            severity="danger"
            icon="pi pi-refresh"
            size="small"
            label="ย้อนรายการ"
            @click="rollback"
          />
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden table-wrapper">
      <ClientOnly>
        <DataTable
          :value="transactions"
          striped-rows
          scrollable
          scroll-height="flex"
          class="text-sm p-datatable-sm p-datatable-stripe"
          table-style="min-width: 50rem"
          :global-filter-fields="['name', 'id', 'username', 'role', 'runId']"
          resizable-columns
          column-resize-mode="fit"
          show-gridlines
          selection-mode="single"
        >
          <Column
            field="runId"
            header="ลำดับที่"
            header-class="[&_.p-column-header-content]:justify-center"
            class="text-center"
          />
          <Column
            field="staff"
            header="ผู้ดำเนินการ"
          />
          <Column
            field="createdAt"
            header="วันที่บันทึก"
          />
          <Column
            field="createdTime"
            header="เวลา"
          />
          <Column
            field="previousBalance"
            :header="isLoan ? 'เงินกู้ยกมา (บาท)' : 'ยอดยกมา (บาท)'"
            header-class="[&_.p-column-header-content]:justify-center"
          >
            <template #body="{ data }">
              <div class="text-right tracking-[1.2px] font-bold">
                {{ strToCurrency(data.previousBalance) || '-' }}
              </div>
            </template>
          </Column>
          <Column
            field="amounts"
            :header="isLoan ? 'เงินกู้ / ชำระ (บาท)' : 'จำนวน (บาท)'"
            header-class="[&_.p-column-header-content]:justify-center"
          >
            <template #body="{ data }">
              <div class="text-right tracking-[1.2px] font-bold">
                {{ strToCurrency(data.amounts) || '-' }}
              </div>
            </template>
          </Column>
          <Column
            field="changeBalance"
            :header="isLoan ? 'เงินกู้คงเหลือ (บาท)' : 'ยอดคงเหลือ (บาท)'"
            header-class="[&_.p-column-header-content]:justify-center"
          >
            <template #body="{ data }">
              <div class="text-right tracking-[1.2px] font-bold">
                {{ strToCurrency(data.changeBalance) || '-' }}
              </div>
            </template>
          </Column>
          <Column
            field="interest"
            header="ดอกเบี้ย (บาท)"
            header-class="[&_.p-column-header-content]:justify-center"
          >
            <template #body="{ data }">
              <div class="text-right tracking-[1.2px] font-bold">
                {{ strToCurrency(data.interest) || '-' }}
              </div>
            </template>
          </Column>
          <Column
            field="action"
            header="ประเภทธุรกรรม"
            header-class="[&_.p-column-header-content]:justify-center"
          >
            <template #body="{ data }">
              <div
                class="flex items-center justify-center gap-2 font-bold text-lg"
                :style="{ color: data.iconColor }"
              >
                <component :is="data.icon" /> {{ data.actionTH }}
              </div>
            </template>
          </Column>
          <Column
            field="note"
            header="หมายเหตุ"
          />
        </DataTable>
      </ClientOnly>
    </div>
    <Dialog
      v-model:visible="isDialogVisible"
      modal
      :header="headerDialog.longTh"
      :breakpoints="{ '1440px': '40vw', '1024px': '60vw', '820px': '80vw', '400px': '90vw' }"
      @hide="resetForm()"
    >
      <form
        class="w-full px-4 bg-white lg:w-[500px] lg:px-8 mx-auto"
        @submit.prevent="onSubmit"
      >
        <Transition
          name="bounce"
          appear
        >
          <div
            v-if="isCalIntresSuccess"
            class="text-green-500 text-right"
          >
            คำนวนดอกเบี้ยเดือนนี้สำเร็จ
          </div>
        </Transition>
        <div>
          <label
            for="amount"
            class="text-lg"
          >ระบุจำนวนเงิน (บาท)*</label>
          <InputNumber
            v-model="amount"
            input-id="amount"
            :max-fraction-digits="2"
            :class="{ 'p-invalid': amountErrorMessage }"
            :input-class="`text-right text-2xl ${isCalIntresSuccess ? 'border-2 border-green-400' : ''}`"
            placeholder="ระบุจำนวนเงิน เช่น 200"
            class="w-full mt-4"
          />
          <small
            v-if="amountErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error block"
          >{{ amountErrorMessage }}</small>
        </div>
        <div class="mt-2">
          <label
            for="staff"
            class="text-lg"
          >ระบุเจ้าหน้าที่ ที่ทำรายการ*</label>
          <Dropdown
            v-model="staff"
            input-id="staff"
            :options="adminList"
            option-value="id"
            option-label="staff"
            :class="{ 'p-invalid': staffErrorMessage }"
            placeholder="เลือกเจ้าหน้าที่"
            class="w-full mt-4"
            input-class="text-right l"
          >
            <template #value="{ value, placeholder }">
              {{ value !== undefined ? `(${findAdminById(value)?.username}) ${findAdminById(value)?.firstname
                || ''} ${findAdminById(value)?.surname || ''}` : placeholder
              }}
            </template>
            <template #option="slotProps">
              <i class="mr-1 pi pi-user" />
              ({{ slotProps.option.username }}) {{ slotProps.option.firstname }} {{ slotProps.option.surname
              }}
            </template>
          </Dropdown>
          <small
            v-if="staffErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ staffErrorMessage }}</small>
        </div>
        <div class="mt-4">
          <div class="flex items-center gap-2">
            <label
              for="note"
              class="block text-lg"
            >หมายเหตุ</label>
            <button
              v-if="note"
              v-tooltip="'ลบหมายเหตุ'"
              class="cursor-pointer p-0 border-none bg-transparent text-red-500 flex items-center"
              @click="note = ''"
            >
              <i
                class="pi pi-times"
                style="font-size: 0.85rem"
              />
            </button>
          </div>
          <Textarea
            id="note"
            v-model="note"
            rows="1"
            cols="10"
            class="w-full"
          />
        </div>

        <div class="mt-4">
          <label
            for="note"
            class="block text-sm"
          >ข้อความอัตโนมัติ</label>
          <div class="chip flex mt-1 border border-solid p-1 border-slate-200 w-fit">
            <select
              v-model="templateWordMonthSelected"
              name="select_month"
              class="inline-block p-inputtext p-component p-0 h-fit"
              style="appearance: auto;"
            >
              <option
                v-for="month in templateWordMonth"
                :key="month"
                :value="month"
              >
                {{ month }}
              </option>
            </select>
            <select
              v-model="templateWordYearSelected"
              name="select_year"
              class="inline-block p-inputtext p-component p-0 h-fit"
              style="appearance: auto;"
            >
              <option
                v-for="year in yearList"
                :key="year"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
            <Button
              type="button"
              label="แทรก"
              icon="pi pi-plus"
              severity="success"
              size="small"
              class="py-0 px-2 ml-1"
              @click="addTempalte(templateWordMonthSelected, templateWordYearSelected)"
            />
          </div>
        </div>

        <div class="flex justify-end mt-8">
          <Button
            type="submit"
            label="ยืนยัน"
            icon="pi pi-check"
            severity="success"
            :loading="loadingTransaction"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>
