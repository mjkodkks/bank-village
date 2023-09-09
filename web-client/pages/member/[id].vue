<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem';
import { getUserProfileByIdService } from '~/services/user';
import { useField, useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { createAccountService, getAccountTypesService } from '~/services/account';
import { mapAccoutType } from '~/utils/account';
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})
const toast = useToast()
const confirm = useConfirm();
const route = useRoute()
const router = useRouter();
const id = route.params.id

const breadcrumbItems = ref<MenuItem[]>([]);
const profile = ref()

async function getUserProfile() {
    const { isSuccess, data, error } = await getUserProfileByIdService(+id)
    if (isSuccess && data) {
        console.log(data)
        breadcrumbItems.value = [
            { label: ' สมาชิก', to: '/member', icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
            { label: id + '' },
        ]
        profile.value = data
        data.accountId.forEach(item => {
            accounts.value.forEach(acc => {
                if (acc.type === item.type) {
                    acc.isOpen = true
                    acc.id = item.id
                    acc.userId = item.userId
                    acc.balance = item.balance
                }
            })
        })
    }
}

// const isCreateAccountDialogVisible = ref(false)

// const { handleSubmit } = useForm();

// const { value: account, errorMessage: accountErrorMessage, resetField } = useField('password', undefined, {
//     initialValue: ''
// });


// const onSubmit = handleSubmit(async (values) => {

// });

const accounts = ref<{
    type: string
    label: string
    isOpen: boolean
    id: number
    userId: number
    balance?: number
}[]>([])
async function getAccountTypes() {
    const { isSuccess, data, error } = await getAccountTypesService()
    if (isSuccess && data) {
        console.log(data)
        accounts.value = data.map((type: string) => {
            return {
                type,
                label: mapAccoutType(type).th,
                isOpen: false
            }
        })
    }

    return data
}

async function onAccountClick(id: number) {
    router.push(`/account/${id}`)
}

async function createAccount(user_id: number, type: string) {
    confirm.require({
        message: 'ยืนยันการเปิดบัญชี',
        header: 'ยือยัน',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            const { isSuccess, data, error } = await createAccountService(user_id, type)
            if (isSuccess && data) {
                console.log(data)
                toast.add({ severity: 'success', summary: 'สร้างบัญชี', detail: 'สร้างบัญชีสำเร็จ', life: 3000 });
                getUserProfile()
            }
            return data
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}


async function init() {
    await getAccountTypes()
    await getUserProfile()
}

init()
</script>

<template>
    <div class="p-8">
        <div class="max-w-lg">
            <Breadcrumb
                :model="breadcrumbItems"
                class="text-xl"
            />
        </div>
        <h3 class="mt-8">ข้อมูลทั่วไป</h3>
        <div
            class="max-w-6xl grid sm:grid-cols-3 mt-4 gap-y-10"
            v-if="profile"
        >
            <div>
                <label for="">หมายเลขบัตรประจำตัวประชาชน</label>
                <div class="font-extralight">{{ profile.citizenId || '' }}</div>
            </div>
            <div>
                <label for="">ชื่อผู้ใช้</label>
                <div class="font-extralight">{{ profile.username || '' }}</div>
            </div>
            <div>
                <label for="">สิทธิ์</label>
                <div class="font-extralight">{{ profile.role || '' }}</div>
            </div>
            <div>
                <label for="">ชื่อจริง</label>
                <div class="font-extralight">{{ (profile.firstname + profile.surname) || '' }}</div>
            </div>
            <div>
                <label for="">วันเกิด</label>
                <div class="font-extralight">{{ profile.brithday || '' }}</div>
            </div>
            <div>
                <label for="">สร้างเมื่อ</label>
                <div class="font-extralight">{{ profile.createdAt || '' }}</div>
            </div>
        </div>
        <div class="mt-4">
            <div class="flex gap-8">
                <h3 class="m-0">ประเภทบัญชี</h3>
                <!-- <Button @click="isCreateAccountDialogVisible = true" class="" icon="pi pi-plus" size="small" label="เปิดบัญชี"></Button> -->
            </div>
            <div class="mt-4">
                <div
                    v-for="accountCard in accounts"
                    @click="() => onAccountClick(accountCard.id)"
                    class="w-[260px] h-[150px] bg-purple-200 shadow-md rounded-md flex items-center justify-center flex-col gap-2 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                    <div>{{ accountCard.label }}</div>
                    <div v-if="accountCard.balance !== undefined">{{ accountCard.balance }} บาท</div>
                    <Button
                        v-if="!accountCard.isOpen"
                        class=""
                        icon="pi pi-plus"
                        size="small"
                        label="เปิดบัญชี"
                        @click.stop="() => createAccount(+id, accountCard.type)"
                    ></Button>
                </div>
            </div>
        </div>
        <!-- <Dialog
            v-model:visible="isCreateAccountDialogVisible"
            modal
            header="เพิ่มบัญชี"
            :style="{ width: '40vw' }"
            :breakpoints="{ '960px': '40vw', '641px': '100vw' }"
        >
            <form
                @submit.prevent="onSubmit"
                class="lg:max-w-xl lg:px-8 px-4 pt-7 w-full bg-white"
            >
                <div class="p-float-label">
                    <InputText
                        id="account"
                        v-model="account"
                        :class="{ 'p-invalid': accountErrorMessage }"
                        placeholder="กรุณาใส่ชื่อผู้ใช้งาน ภาษาอังกฤษ ตามบัตรประชาชน"
                        class="w-full"
                    />
                    <label for="account">ประเภทบัญชี</label>
                </div>
                <small
                class="text-pink-500 font-extralight mt-2 p-error"
                v-if="accountErrorMessage"
            >{{ accountErrorMessage }}</small>

            <div class="mt-8">
                <Button
                    type="submit"
                    label="เพิ่มบัญชี"
                ></Button>
            </div>
        </form>
    </Dialog> -->
</div></template>