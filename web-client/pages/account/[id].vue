<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem';
import { useField, useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { getAccountProfileService, transactionDepositService, transactionWithdrawService } from '~/services/account';
import { useConfirm } from "primevue/useconfirm";
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';
import { mapTransactionType } from '~/utils/account';

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

const breadcrumbItems = ref<MenuItem[]>([
    { label: 'สมาชิก', to: '/member', icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
    { label: 'บัญชี', to: `/member/${userId}`, icon: 'pi pi-wallet', class: '[&_.p-menuitem-text]:ml-2' },
]);

const { handleSubmit } = useForm();

const { value: amount, errorMessage: amountErrorMessage, resetField } = useField<number>('amount', toTypedSchema(z.number().nonnegative({
    message: 'ไม่สามารถใส่ค่าที่เป็นลบได้'
}).safe().min(1, {
    message: 'กรุณาใส่เงินที่มากกว่าหรือเท่ากับ 1 บาท เป็นอย่างน้อย'
})), {
    initialValue: 0
});


const onSubmit = handleSubmit(async (values) => {
    console.log(values)
    const { amount } = values
    confirm.require({
        message: `ยืนยันการ (${headerDialog.value}) จำนวน ${amount} บาท`,
        header: 'ยืนยัน',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            transaction(+id, amount, dialogMode.value)
        },
    });
});

const loadingTransaction = ref(false)
async function transaction(accountId: number, amount: number, type: string) {
    let transactionService;
    let successMessage;
    let modeMessage

    if (type === 'withdraw') {
        transactionService = transactionWithdrawService;
        modeMessage = 'การถอน'
        successMessage = 'การถอนสำเร็จ';
    } else if (type === 'deposit') {
        transactionService = transactionDepositService;
        modeMessage = 'การฝาก'
        successMessage = 'การฝากสำเร็จ';
    }

    if (transactionService) {
        loadingTransaction.value = true
        const { isSuccess, data, error } = await transactionService(accountId, amount);
        if (isSuccess && data) {
            toast.add({ severity: 'success', summary: type, detail: successMessage, life: 3000 });
            console.info(data);
            init()
            isDialogVisible.value = false;
            loadingTransaction.value = false;
        } else {
            const err = (error as any).statusMessage
            toast.add({ severity: 'warn', summary: 'เข้าสู่ระบบไม่สำเร็จ', detail: 'การเข้าสู่ระบบไม่สำเร็จ ชื่อผู้ใช้ / รหัสผ่าน ไม่ถูกต้อง\n' + 'system message : ' + err, life: 8000 });
            loadingTransaction.value = false;
        }
    }
}

const profile = ref()
async function getAccountProfile(id: number) {
    const { isSuccess, data, error } = await getAccountProfileService(id)
    if (isSuccess && data) {
        console.log(data)
        profile.value = {
            ...data,
            type: mapAccoutType(data.type).th,
            createdAt: dayjs(data.createdAt).format('ddd DD MMMM YYYY เวลา HH:mm:ss')
        }
        breadcrumbItems.value.push({ label: `${data.type} (${id})` })
    }

    return data
}

const transactions = ref([])
async function getTransactions(id: number) {
    const { isSuccess, data, error } = await getTransactionsServier(id)
    if (isSuccess && data) {
        console.log(data)
        transactions.value = data.map(m => {
            return {
                ...m,
                createdAt: dayjs(m.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            }
        })
    }

    return data
}

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
    if (type === 'deposit') {
        dialogMode.value = 'deposit'
    }

    if (type === 'withdraw') {
        dialogMode.value = 'withdraw'
    }

    if (type === 'interest') {
        dialogMode.value = 'interest'
    }
}

async function init() {
    await getAccountProfile(+id)
    await getTransactions(+id)
}

init()
</script>

<template>
    <div class="p-8 h-full md:flex md:flex-col">
        <div class="max-w-lg">
            <Breadcrumb
                :model="breadcrumbItems"
                class="text-xl"
            />
        </div>
        <h3 class="mt-8">ข้อมูลทั่วไป</h3>
        <div
            class="max-w-6xl grid sm:grid-cols-3 gap-y-5 2xl:gap-y-10"
            v-if="profile"
        >
            <div>
                <label for="">จำนวนเงิน</label>
                <div class="font-extralight">{{ profile.balance || '' }}</div>
            </div>
            <div>
                <label for="">ประเภทบัญชี</label>
                <div class="font-extralight">{{ profile.type || '' }}</div>
            </div>
            <div>
                <label for="">เจ้าของบัญชี</label>
                <div class="font-extralight">{{ profile.owner?.username || '' }}</div>
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
                size="large"
                severity="success"
                icon="pi pi-angle-double-up"
                label="ฝาก"
            ></Button>
            <Button
                @click="() => openDialogTransaction('withdraw')"
                size="large"
                icon="pi pi-angle-double-down"
                label="ถอน"
            ></Button>
            <Button
                @click="() => openDialogTransaction('interest')"
                severity="warning"
                icon="pi pi-star"
                size="large"
                label="ดอกเบี้ย"
            ></Button>
        </div>
        <h3>บันทึกรายการธุรกรรม</h3>
        <div class="table-wrapper flex-1 overflow-hidden">
            <ClientOnly>
                <DataTable
                    :value="transactions"
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                    class="p-datatable-sm text-sm"
                    tableStyle="min-width: 50rem"
                    :globalFilterFields="['name', 'id', 'username', 'role']"
                    resizableColumns
                    columnResizeMode="fit"
                    showGridlines
                >
                    <Column
                        field="id"
                        header="เลขที่"
                    ></Column>
                    <Column
                        field="action"
                        header="ประเภทธุรกรรม"
                    >
                        <template #body="{ data }">
                            <div :style="{ color: mapTransactionType(data.action).color }">{{ data.action  }}</div>
                        </template>
                    </Column>
                    <Column
                        field="createdAt"
                        header="เวลา"
                    >
                    </Column>
                    <Column
                        field="previousBalance"
                        header="ยอดยกมา (บาท)"
                    ></Column>
                    <Column
                        field="amounts"
                        header="จำนวน (บาท)"
                    ></Column>
                    <Column
                        field="changeBalance"
                        header="ยอดคงเหลือ (บาท)"
                    ></Column>
                    <Column
                        field="staff"
                        header="ผู้ดำเนินการ"
                    ></Column>
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
            :header="headerDialog"
            :style="{ width: '30vw' }"
            :breakpoints="{ '960px': '40vw', '641px': '100vw' }"
        >
            <form
                @submit.prevent="onSubmit"
                class="lg:max-w-xl lg:px-8 lg:ml-auto px-4 pt-7 w-full bg-white"
            >
                <div class="">
                    <label
                        for="account"
                        class="text-lg"
                    >ระบุจำนวนเงิน (บาท)</label>
                    <InputNumber
                        inputId="account"
                        v-model="amount"
                        :maxFractionDigits="2"
                        :class="{ 'p-invalid': amountErrorMessage }"
                        placeholder="ระบุจำนวนเงิน เช่น 200"
                        class="w-full mt-4"
                        inputClass="text-right text-2xl"
                    />
                </div>
                <small
                    class="text-pink-500 font-extralight mt-2 p-error"
                    v-if="amountErrorMessage"
                >{{ amountErrorMessage }}</small>

                <div class="mt-8 flex justify-end">
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
    </div>
</template>