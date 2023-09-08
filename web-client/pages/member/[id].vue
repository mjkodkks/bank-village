<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem';
import { getUserProfileByIdService } from '~/services/user';
import { useField, useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';

definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})
const toast = useToast()
const route = useRoute()
const id = route.params.id

const items = ref<MenuItem[]>([]);
const profile = ref()

async function getUserProfile() {
    const { isSuccess, data, error } = await getUserProfileByIdService(+id)
    if (isSuccess && data) {
        console.log(data)
        items.value = [
            { label: ' สมาชิก', to: '/member', icon: 'pi pi-user', class: '[&_.p-menuitem-text]:ml-2' },
            { label: id + '' },
        ]
        profile.value = data
    }
}

const isCreateAccountDialogVisible = ref(false)

const { handleSubmit } = useForm();

const { value: account, errorMessage: accountErrorMessage, resetField } = useField('password', undefined, {
    initialValue: ''
});

const onSubmit = handleSubmit(async (values) => {
    const { username, citizenId, role, password } = values
    const isAdmin = role === 'ADMIN'
    const { isSuccess, data, error } = await createUserService({username, password: isAdmin ? password: undefined, citizenId, isAdmin: isAdmin })
    if (isSuccess) {
        console.log(data)
        toast.add({ severity: 'success', summary: 'สร้างสมาชิก', detail: 'สร้างสมาชิกสำเร็จ', life: 3000 });
        getUserProfile()
    } else {
        console.error(error)
    }
    isCreateAccountDialogVisible.value = false
});


function init() {
    getUserProfile()
}

init()
</script>

<template>
    <div class="p-8">
        <div class="max-w-lg">
            <Breadcrumb :model="items" class="text-xl" />
        </div>
        <div class="max-w-6xl grid grid-cols-3 mt-4" v-if="profile">
            <div>
                <label for="">หมายเลขบัตรประจำตัวประชาชน</label>
                <div class="font-extralight">{{  profile.citizenId || '' }}</div>
            </div>
            <div>
                <label for="">ชื่อผู้ใช้</label>
                <div class="font-extralight">{{  profile.username || '' }}</div>
            </div>
            <div>
                <label for="">สิทธิ์</label>
                <div class="font-extralight">{{  profile.role || '' }}</div>
            </div>
        </div>
        <div class="mt-4">
            <div class="flex gap-8">
                <h3 class="m-0">ประเภทบัญชี</h3>
                <Button @click="isCreateAccountDialogVisible = true" class="" icon="pi pi-plus" size="small" label="เปิดบัญชี"></Button>
            </div>
            <div class="mt-4">
                <div class="w-[260px] h-[150px] bg-purple-200 shadow-md rounded-md flex items-center justify-center flex-col gap-2 cursor-pointer hover:scale-105 transition-all duration-300">
                    <div>บัญชีออมทรัพย์</div>
                    <Button class="" icon="pi pi-plus" size="small" label="เปิดบัญชี"></Button>
                </div>
            </div>
        </div>
        <Dialog
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
        </Dialog>
    </div>
</template>