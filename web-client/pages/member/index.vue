<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useField, useForm } from 'vee-validate';
import { z } from 'zod'
import { createUserService } from '~/services/user';
import { roles } from '~/utils/roles'
definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})

const toast = useToast()
const router = useRouter()

function rowClick({ data }: any) {
    console.log(data)
    const { id } = data
    router.push({
        path: `/member/${id}`
    })
}

const rolesList = ref(roles)

const { handleSubmit } = useForm();

const { value: username, errorMessage: usernameErrorMessage } = useField('username', toTypedSchema(z.string().nonempty({
    message: 'ต้องใส่ชื่อผู้ใช้งาน'
})), {
    initialValue: ''
});
const { value: citizenId, errorMessage: citizenIdErrorMessage } = useField('citizenId', toTypedSchema(z.string().nonempty({
    message: 'ต้องใส่เลขบัตรประจำตัวประชาชน'
})), {
    initialValue: ''
});
const { value: role, errorMessage: roleErrorMessage } = useField('role', toTypedSchema(z.string().nonempty({
    message: 'ต้องใส่ตำแหน่ง'
})), {
    initialValue: 'USER'
});
const { value: password, errorMessage: passwordErrorMessage, resetField } = useField('password', validateFieldPassword, {
    initialValue: ''
});

function validateFieldPassword(value: any) {
    if (role.value === 'ADMIN') {
        if (!value) {
            return 'กรุณาใส่รหัสผ่าน';
        }
    }

    return true;
}
console.log(role.value)

const onSubmit = handleSubmit(async (values) => {
    const { username, citizenId, role, password } = values
    const isAdmin = role === 'ADMIN'
    const { isSuccess, data, error } = await createUserService({username, password: isAdmin ? password: undefined, citizenId, isAdmin: isAdmin })
    if (isSuccess) {
        console.log(data)
        toast.add({ severity: 'success', summary: 'สร้างสมาชิก', detail: 'สร้างสมาชิกสำเร็จ', life: 3000 });
        fetctUser()
    } else {
        console.error(error)
    }
    isCreateUserDialogVisible.value = false
});

const isCreateUserDialogVisible = ref(false)

const users = ref()
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

async function fetctUser() {
    const { isSuccess, data, error } = await getlistUserService()
    if (isSuccess && data) {
        console.log(isSuccess)
        users.value = [...data]
    }
}

function init() {
    fetctUser()
}

init()

</script>

<template>
    <div class="h-full p-2 xl:p-4">
        <h1>สมาชิก / ค้นหาสมาชิก</h1>
        <div class="header flex gap-2">
            <div class="flex justify-content-end">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                        v-model="filters['global'].value"
                        placeholder="ค้นหาสมาชิกที่นี้"
                    />
                </span>
            </div>
            <div class="ml-auto">
                <Button
                    @click="isCreateUserDialogVisible = true"
                    icon="pi pi-user-plus"
                    label="เพิ่มสมาชิก"
                ></Button>
            </div>
        </div>
        <div class="table-wrapper mt-4">
            <ClientOnly>
                <DataTable
                    :value="users"
                    stripedRows
                    class="p-datatable-sm text-sm"
                    tableStyle="min-width: 50rem"
                    v-model:filters="filters"
                    :globalFilterFields="['name', 'id', 'username', 'role']"
                    @row-click="rowClick"
                >
                    <Column
                        field="id"
                        header="รหัสสมาชิก"
                    ></Column>
                    <Column
                        field="username"
                        header="ชื่อผู้ใช้งาน"
                    ></Column>
                    <Column
                        field="name"
                        header="ชื่อ นามสกุล"
                    ></Column>
                    <Column
                        field="address"
                        header="ที่อยู่"
                    ></Column>
                    <Column
                        field="citizenId"
                        header="เลขบัตรประจำตัวประชาชน"
                    ></Column>
                    <Column
                        field="role"
                        header="ตำแหน่ง"
                    ></Column>
                </DataTable>
            </ClientOnly>
        </div>
        <Dialog
            v-model:visible="isCreateUserDialogVisible"
            modal
            header="เพิ่มสมาชิก"
            :style="{ width: '40vw' }"
            :breakpoints="{ '960px': '40vw', '641px': '100vw' }"
            
        >
            <form
                @submit.prevent="onSubmit"
                class="lg:max-w-xl lg:px-8 px-4 pt-7 w-full bg-white"
            >
                <div class="p-float-label">
                    <InputText
                        id="username"
                        v-model="username"
                        :class="{ 'p-invalid': usernameErrorMessage }"
                        placeholder="กรุณาใส่ชื่อผู้ใช้งาน ภาษาอังกฤษ ตามบัตรประชาชน"
                        class="w-full"
                    />
                    <label for="username">ชื่อผู้ใช้ (ภาษาอังกฤษ)</label>
                </div>
                <small
                    class="text-pink-500 font-extralight mt-2 p-error"
                    v-if="usernameErrorMessage"
                >{{ usernameErrorMessage }}</small>
                <div class="p-float-label mt-6">
                    <InputText
                        id="citizenId"
                        v-model="citizenId"
                        :class="{ 'p-invalid': citizenIdErrorMessage }"
                        placeholder="กรุณาใส่เลขบัตรประจำตัวประชาชน"
                        class="w-full"
                    />
                    <label for="citizenId">เลขบัตรประจำตัวประชาชน</label>
                </div>
                <small
                    class="text-pink-500 font-extralight mt-2 p-error"
                    v-if="citizenIdErrorMessage"
                >{{ citizenIdErrorMessage }}</small>
                <div class="p-float-label mt-6">
                    <Dropdown
                        v-model="role"
                        :options="rolesList"
                        optionValue="value"
                        optionLabel="label"
                        placeholder="เลือกตำแหน่ง"
                        class="w-full md:w-[200px]"
                        @change="() => resetField()"
                    />
                    <label for="citizenId">สิทธิ์</label>
                </div>
                <small
                    class="text-pink-500 font-extralight mt-2 p-error"
                    v-if="roleErrorMessage"
                >{{ roleErrorMessage }}</small>
                <div
                    v-show="role === 'ADMIN'"
                    :key="'passwordinput'"
                >
                    <div class="p-float-label mt-6">
                        <InputText
                            id="oassword"
                            v-model="password"
                            :class="{ 'p-invalid': passwordErrorMessage }"
                            placeholder="กรุณาใส่รหัสผ่าน"
                            class="w-full"
                        />
                        <label for="password">รหัสผ่าน (เฉพาะเจ้าหน้าที่)</label>
                    </div>
                    <small
                        class="text-pink-500 font-extralight mt-2 p-error"
                        v-if="passwordErrorMessage"
                    >{{ passwordErrorMessage }}</small>
                </div>
                <div class="mt-8">
                    <Button
                        type="submit"
                        label="เพิ่มสมาชิก"
                    ></Button>
                </div>
            </form>
        </Dialog>
</div></template>
