<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';
import { useField, useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { getAccountProfileService, interestPerYearService, rollbackTransactionService, transactionDepositService, transactionInterestService, transactionWithdrawService } from '~/services/account';
import { useConfirm } from "primevue/useconfirm";
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import { type Transaction, mapTransactionType } from '~/utils/account';
import { getAdminListService } from '~/services/user';
import IconsDeposit from '~/components/icons/Deposit.vue';
import IconsWithdraw from '~/components/icons/Withdraw.vue';
import IconsInterset from '~/components/icons/Interest.vue';
import type { AdminList } from "~/utils/user"

definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})
const toast = useToast()
const confirm = useConfirm();
const dayjs = useDayjs()
const route = useRoute()
const router = useRouter();
const id = route.params.id
const userId = route.query.userId
const { strToCurrency } = useNumber()
const mainStore = useMainStore()

const breadcrumbItems = ref<MenuItem[]>([
    { label: 'สมาชิก', to: '/member', icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
    { label: 'โปรไฟล์สมาชิก', to: `/member/${userId}`, icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
]);

const { handleSubmit, resetForm } = useForm();

const { value: amount, errorMessage: amountErrorMessage, resetField: resetFieldAmount } = useField<number>('amount', toTypedSchema(z.number().nonnegative({
    message: 'ไม่สามารถใส่ค่าที่เป็นลบได้'
}).safe().min(0.01, {
    message: 'กรุณาใส่เงินที่มากกว่าหรือเท่ากับ 0.01 บาท เป็นอย่างน้อย'
})), {
    initialValue: 0
});

const { value: staff, errorMessage: staffErrorMessage, resetField: resetFieldStaff } = useField<number | undefined>('staff', toTypedSchema(z.number().min(1, {
    message: 'กรุณาใส่ผู้ดำเนินการ'
})), {
    initialValue: undefined
});

const { value: note, errorMessage: noteErrorMessage, resetField: resetFieldNote } = useField<string | undefined>('note', undefined, {
    initialValue: undefined
});


const onSubmit = handleSubmit(async (values) => {
    // console.log(values)
    const { amount, staff, note } = values
    const userId = staff
    confirm.require({
        message: `ยืนยันการ (${headerDialog.value}) จำนวน ${amount} บาท`,
        header: 'ยืนยัน',
        acceptLabel: 'ใช่, ยืนยัน',
        rejectLabel: 'ไม่',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            transaction(+id, amount, dialogMode.value, userId, note)
        },
    });
});

const loadingTransaction = ref(false)
async function transaction(accountId: number, amount: number, type: string, userId?: number, note?: string) {
    let transactionService;
    let successMessage;
    let errMessage;
    let modeMessage;

    if (type === 'withdraw') {
        transactionService = transactionWithdrawService;
        modeMessage = 'การถอน'
        successMessage = 'การถอนสำเร็จ';
        errMessage = 'การถอนไม่สำเร็จ';
    } else if (type === 'deposit') {
        transactionService = transactionDepositService;
        modeMessage = 'การฝาก'
        successMessage = 'การฝากสำเร็จ';
        errMessage = 'การฝากไม่สำเร็จ';
    } else if (type === 'interest') {
        transactionService = transactionInterestService;
        modeMessage = 'การฝากดอกเบี้ย'
        successMessage = 'การฝากดอกเบี้ยสำเร็จ';
        errMessage = 'การฝากดอกเบี้ยไม่สำเร็จ';
    }

    if (transactionService) {
        loadingTransaction.value = true
        const { isSuccess, data, error } = await transactionService(accountId, amount, userId, note);
        if (isSuccess && data) {
            toast.add({ severity: 'success', summary: type, detail: successMessage, life: 5000 });
            console.info(data);
            init()
            isDialogVisible.value = false;
            loadingTransaction.value = false;
        } else {
            const err = (error as any).statusMessage
            toast.add({ severity: 'warn', summary: type, detail: `${errMessage}  system message: ${err}`, life: 8000 });
            loadingTransaction.value = false;
        }
    }
}

const profile = ref<AccountDetails>()
async function getAccountProfile(id: number) {
    const { isSuccess, data, error } = await getAccountProfileService(id)
    if (isSuccess && data) {
        // console.log(data)
        profile.value = {
            ...data,
            typeTH: mapAccoutType(data.type).th,
            createdAt: dayjs(data.createdAt).format('ddd DD MMMM YYYY เวลา HH:mm:ss')
        }
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
        transactions.value = data.map(m => {
            return {
                ...m,
                staff: typeof m.staff !== 'string' ? `${m.staff?.username ? '(' + m.staff.username + ')' : ''}` : '',
                createdAt: dayjs(m.createdAt).format('DD MMM BBBB'),
                createdTime: dayjs(m.createdAt).format('HH:mm:ss'),
                actionTH: mapTransactionType(m.action).th,
                icon: m.action === 'DEPOSIT' ? markRaw(IconsDeposit) : m.action === 'WITHDRAWAL' ? markRaw(IconsWithdraw) : m.action === 'INTEREST' ? markRaw(IconsInterset) : null
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

const { calInterestByType } = useInterest()
const isCalIntresSuccess = ref(false)

const isDialogVisible = ref(false)
const dialogMode = ref<'deposit' | 'withdraw' | 'interest'>('deposit')
const headerDialog = computed(() => {
    const template = {
        deposit: 'ฝากเงิน',
        withdraw: 'ถอนเงิน',
        interest: 'ฝากดอกเบี้ย',
    }
    return template[dialogMode.value]
})
function openDialogTransaction(type: string) {
    isDialogVisible.value = true
    amount.value = 0
    staff.value = mainStore.id
    note.value = undefined
    if (type === 'deposit') {
        dialogMode.value = 'deposit'
    } else if (type === 'withdraw') {
        dialogMode.value = 'withdraw'
    } else  if (type === 'interest') {
        dialogMode.value = 'interest'
        isCalIntresSuccess.value = true
        if(profile.value?.balance) {
            amount.value = calInterestByType(+profile.value.balance, profile.value.type)
            setTimeout(() => {
                isCalIntresSuccess.value = false
            }, 4000);
        }
    }
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
                toast.add({ severity: 'success', summary: 'การย้อนรายการ', detail: 'การย้อนรายการสำเร็จ', life: 5000 });
                console.info(data);
                init()
            } else {
                const err = (error as any).data.message
                toast.add({ severity: 'warn', summary: 'การย้อนรายการ', detail: 'การย้อนรายการไม่สำเร็จ \n' + 'system message : ' + err, life: 8000 });
            }
        },
    });
}

async function init() {
    await getAccountProfile(+id)
    await getTransactions(+id)
    await getInterestPerYear(+id)
    getAdminList()
}

init()
</script>

<template>
    <div class="px-8 py-4 h-[calc(100%_-_60px)] md:flex md:flex-col">
        <div class="max-w-lg">
            <Breadcrumb
                :model="breadcrumbItems"
                class="p-2"
            >
                <template #item="{ label, item, props }">
                    <NuxtLink v-if="item.to" :to="item.to" class="text-primary underline decoration-1 hover:text-pink-600">
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
        <h3 class="mt-4">ข้อมูลทั่วไป</h3>
        <div
            class="grid max-w-6xl sm:grid-cols-3 gap-y-5 2xl:gap-y-4"
            v-if="profile"
        >
            <div>
                <label for="">จำนวนเงิน</label>
                <div class="tracking-[1.2px] font-bold">{{ strToCurrency(profile.balance) || '' }}</div>
            </div>
            <div>
                <label for="">ประเภทบัญชี</label>
                <div class="font-extralight">{{ profile?.typeTH || '' }}</div>
            </div>
            <div>
                <label for="">เจ้าของบัญชี</label>
                <div class="font-extralight">{{ profile.owner?.username ? '(' + profile.owner?.username + ')' : '' }} {{
                    profile.owner?.firstname || '' }} {{ profile.owner?.surname || '' }}</div>
            </div>
            <div>
                <label for="">สร้างเมื่อ</label>
                <div class="font-extralight">{{ profile.createdAt || '' }}</div>
            </div>
        </div>
        <div
            class="flex gap-2 mt-4 2xl:mt-8"
            v-if="profile"
        >
            <Button
                @click="() => openDialogTransaction('deposit')"
                severity="success"
                icon="pi pi-angle-double-up"
                label="ฝาก"
            >
            <template #icon> 
                <IconsDeposit class="mr-2"></IconsDeposit>
            </template>
        </Button>
            <Button
                @click="() => openDialogTransaction('withdraw')"
                icon="pi pi-angle-double-down"
                label="ถอน"
            >
            <template #icon> 
                <IconsWithdraw class="mr-2"></IconsWithdraw>
            </template>
        </Button>
            <Button
                @click="() => openDialogTransaction('interest')"
                severity="warning"
                icon="pi pi-star"
                label="ดอกเบี้ย"
            >
            <template #icon> 
                <IconsInterest class="mr-2"></IconsInterest>
            </template></Button>
        </div>
        <div class="flex">
            <h3>บันทึกรายการธุรกรรม</h3>
            <div class="ml-auto flex items-center gap-2">
                <div v-if="sumOfInterests" class="border-[#655DBB] border-solid p-2 rounded-lg font-light">
                    <i class="pi pi-star text-yellow-400"></i>
                    ดอกเบี้ยปีนี้ <span class="tracking-[1.2px] font-bold">{{ sumOfInterests }}</span> (บาท)</div>
                <div>
                    <Button
                        @click="rollback"
                        severity="danger"
                        icon="pi pi-refresh"
                        size="small"
                        label="ย้อนรายการ"
                    ></Button>
                </div>
            </div>
        </div>
        <div class="flex-1 overflow-hidden table-wrapper">
            <ClientOnly>
                <DataTable
                    :value="transactions"
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                    class="text-sm p-datatable-sm p-datatable-stripe"
                    tableStyle="min-width: 50rem"
                    :globalFilterFields="['name', 'id', 'username', 'role']"
                    resizableColumns
                    columnResizeMode="fit"
                    showGridlines
                    selectionMode="single"
                >
                    <Column
                        field="id"
                        header="เลขที่"
                    ></Column>
                    <Column
                        field="staff"
                        header="ผู้ดำเนินการ"
                    ></Column>
                    <Column
                        field="createdAt"
                        header="วันที่บันทึก"
                    >
                    </Column>
                    <Column
                        field="createdTime"
                        header="เวลา"
                    >
                    </Column>
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
                        :header="isLoan ? 'จำนวนเงินกู้ (บาท)' : 'จำนวน (บาท)'"
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
                            <div class="flex items-center justify-center gap-2 font-bold text-lg" :style="{ color: mapTransactionType(data.action).color }">
                             <component :is="data.icon"></component> {{ data.actionTH }}
                            </div>
                        </template>
                    </Column>
                    <Column
                        field="note"
                        header="หมายเหตุ"
                    ></Column>
                </DataTable>
            </ClientOnly>
        </div>
        <Dialog
            v-model:visible="isDialogVisible"
            modal
            @hide="resetForm()"
            :header="headerDialog"
            :breakpoints="{ '1440px': '40vw', '1024px': '60vw', '820px': '80vw', '400px': '90vw' }"
        >
            <form
                @submit.prevent="onSubmit"
                class="w-full px-4 bg-white lg:w-[500px] lg:px-8 mx-auto"
            >
                <Transition name="bounce" appear>
                    <div v-if="isCalIntresSuccess" class="text-green-500 text-right">คำนวนดอกเบี้ยเดือนนี้สำเร็จ</div>
                </Transition>
                <div>
                    <label
                        for="amount"
                        class="text-lg"
                    >ระบุจำนวนเงิน (บาท)*</label>
                    <InputNumber
                        inputId="amount"
                        v-model="amount"
                        :maxFractionDigits="2"
                        :class="{ 'p-invalid': amountErrorMessage }"
                        :input-class="`text-right text-2xl ${isCalIntresSuccess ? 'border-2 border-green-400': ''}`"
                        placeholder="ระบุจำนวนเงิน เช่น 200"
                        class="w-full mt-4"
                    />
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error block"
                        v-if="amountErrorMessage"
                    >{{ amountErrorMessage }}</small>
                </div>
                <div class="mt-2">
                    <label
                        for="staff"
                        class="text-lg"
                >ระบุเจ้าหน้าที่ ที่ทำรายการ*</label>
                    <Dropdown
                        inputId="staff"
                        v-model="staff"
                        :options="adminList"
                        option-value="id"
                        option-label="staff"
                        :class="{ 'p-invalid': staffErrorMessage }"
                        placeholder="เลือกเจ้าหน้าที่"
                        class="w-full mt-4"
                        inputClass="text-right l"
                    >
                        <template #value="{ value, placeholder }">
                            {{ value !== undefined ? `(${findAdminById(value)?.username}) ${findAdminById(value)?.firstname || ''} ${findAdminById(value)?.surname || ''}` : placeholder
                            }}
                        </template>
                        <template #option="slotProps">
                            <i class="mr-1 pi pi-user"></i>
                            ({{ slotProps.option.username }}) {{ slotProps.option.firstname }} {{ slotProps.option.surname
                            }}
                        </template>
                    </Dropdown>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="staffErrorMessage"
                    >{{ staffErrorMessage }}</small>
                </div>
                <div class="mt-4">
                    <label
                        for="note"
                        class="block text-lg"
                    >หมายเหตุ</label>
                    <Textarea
                        id="note"
                        v-model="note"
                        rows="1"
                        cols="10"
                        class="w-full"
                    />
                </div>

                <div class="flex justify-end mt-8">
                    <Button
                        type="submit"
                        label="ยืนยัน"
                        icon="pi pi-check"
                        severity="success"
                    :loading="loadingTransaction"
                ></Button>
            </div>
        </form>
    </Dialog>
</div></template>