<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { FilterMatchMode } from 'primevue/api';
import { useConfirm } from 'primevue/useconfirm';
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
const dayjs = useDayjs()
const confirm = useConfirm()

function rowClick({ data }: any) {
    // console.log(data)
    const { id } = data
    router.push({
        path: `/member/${id}`
    })
}

const rolesList = ref(roles)

const { handleSubmit, resetForm } = useForm();

const { value: citizenId, errorMessage: citizenIdErrorMessage } = useField<string | undefined>('citizenId', toTypedSchema(z.string().nullish()), {
    initialValue: ''
});
const { value: firstname, errorMessage: firstnameErrorMessage, resetField: firstnameResetField } = useField('firstname', toTypedSchema(z.string().nonempty({
    message: 'กรุณาใส่ชื่อจริง'
})), {
    initialValue: ''
});
const { value: surname, errorMessage: surnameErrorMessage } = useField('surname', toTypedSchema(z.string().nonempty({
    message: 'กรุณาใส่นามสกุล'
})), {
    initialValue: ''
});
const { value: address, errorMessage: addressErrorMessage, resetField: addressResetField } = useField('address', toTypedSchema(z.string().nonempty({
    message: 'กรุณาใส่ที่อยู่'
})), {
    initialValue: ''
});
const { value: tel, errorMessage: telErrorMessage } = useField('tel', toTypedSchema(z.string({
    description: ''
}).max(16)), {
    initialValue: ''
});
const { value: role, errorMessage: roleErrorMessage } = useField('role', toTypedSchema(z.string().nonempty({
    message: 'กรุณาใส่ตำแหน่ง'
})), {
    initialValue: 'USER'
});

const { value: username, errorMessage: usernameErrorMessage } = useField('username', validateFieldUsername, {
    initialValue: ''
});

const { value: password, errorMessage: passwordErrorMessage, resetField } = useField('password', validateFieldPassword, {
    initialValue: ''
});

function validateFieldUsername(value: any) {
    if (role.value === 'ADMIN') {
        if (!value) {
            return 'กรุณาใส่ชื่อ Username';
        }
    }

    return true;
}
function validateFieldPassword(value: any) {
    if (role.value === 'ADMIN') {
        if (!value) {
            return 'กรุณาใส่รหัสผ่าน';
        }
    }

    return true;
}

const loadingCreateUser = ref(false)
const onSubmit = handleSubmit(async (values) => {
    // console.log(values)
    const { username, citizenId, role, password, firstname, surname, address, tel } = values as {
        username: string
        citizenId: string
        role: ROLE
        password: string
        firstname: string
        surname: string
        address: string
        tel: string
    }

    loadingCreateUser.value = true
    const isAdmin = role === 'ADMIN'
    const confirmCreateUser = confirm
    confirm.require({
        message: `ยืนยันการสร้าง${isAdmin ? 'เจ้าหน้าที่' : 'สมาชิก'}`,
        header: 'ยืนยัน',
        acceptLabel: 'ใช่, ยืนยัน',
        rejectLabel: 'ไม่',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            const { isSuccess, data, error } = await createUserService(
                {
                    username: isAdmin ? username : undefined,
                    password: isAdmin ? password : undefined,
                    citizenId, role, address, firstname, surname, tel
                })
            if (isSuccess && data) {
                // console.log(data)
                toast.add({ severity: 'success', summary: 'สร้างสมาชิก', detail: 'สร้างสมาชิกสำเร็จ', life: 5000 });
                fetctUser()
            } else {
                console.error(error)
                toast.add({ severity: 'warn', summary: 'สร้างสมาชิก', detail: 'สร้างสมาชิกไม่สำเร็จ', life: 10000 });
            }
            isCreateUserDialogVisible.value = false
            loadingCreateUser.value = false
        },
        onHide() {
            loadingCreateUser.value = false
        },
        reject: () => {
            loadingCreateUser.value = false
        }
    });
});

const isCreateUserDialogVisible = ref(false)

const users = ref<User[]>([])
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const userLoading = ref(false)
async function fetctUser() {
    userLoading.value = true
    const { isSuccess, data, error } = await getlistUserService()
    if (isSuccess && data) {
        // console.log(isSuccess)
        users.value = data.map(m => {
            return {
                ...m,
                name: m.firstname + ' ' + m.surname,
                createdAt: dayjs(m.createdAt).format('DD/MM/YYYY HH:mm'),
                role: mapRole(m.role).th
            }
        })
    }
    setTimeout(() => {
        userLoading.value = false
    }, 500);
    return data
}

const usersCount = computed(() => users && users.value.length)

function init() {
    fetctUser()
}

init()

</script>

<template>
    <div class="h-[calc(100%_-_60px)] px-2 md:px-6 xl:px-8 py-4 flex flex-col">
        <h1 class="my-0">สมาชิก / ค้นหาสมาชิก</h1>
        <div>
            <hr class="border border-gray-200 border-solid" />
        </div>
        <div class="flex gap-2 mt-4 header">
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
        <div
            v-if="users"
            class="mt-4"
        >
            จำนวนสมาชิก ({{ usersCount }})
        </div>
        <div class="flex-1 mt-4 overflow-hidden table-wrapper">
            <template v-if="!userLoading">
                <DataTable
                    :value="users"
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                    class="text-sm p-datatable-sm row-selected"
                    tableStyle="min-width: 50rem"
                    v-model:filters="filters"
                    :globalFilterFields="['name', 'id', 'username', 'role']"
                    @row-click="rowClick"
                    selectionMode="single"
                >
                    <Column
                        field="id"
                        header="รหัสสมาชิก"
                    ></Column>
                    <Column
                        field="username"
                        header="ชื่อผู้ใช้งาน"
                    >
                        <template #body="{ data }">
                            {{ data.username || '-' }}
                        </template>
                    </Column>
                    <Column
                        field="name"
                        header="ชื่อ นามสกุล"
                    >
                        <template #body="{ data }">
                           <span class="underline text-primary hover:text-pink-600">{{ data.name || '-' }}</span>
                        </template>
                    </Column>
                    <Column
                        field="address"
                        header="ที่อยู่"
                    ></Column>
                    <Column
                        field="tel"
                        header="เบอร์โทรศํพท์"
                    >
                        <template #body="{ data }">
                            {{ data.tel || '-' }}
                        </template>
                    </Column>
                    <Column
                        field="citizenId"
                        header="เลขบัตรประจำตัวประชาชน"
                    >
                        <template #body="{ data }">
                            {{ data.citizenId || '-' }}
                        </template>
                    </Column>
                    <Column
                        field="role"
                        header="ตำแหน่ง"
                    ></Column>
                    <Column
                        field="createdAt"
                        header="เริ่มใช้งาน"
                    ></Column>
                </DataTable>
            </template>
            <template v-else>
                <TableLoading
                    :cols="7"
                    :rows="8"
                ></TableLoading>
            </template>
        </div>
        <Dialog
            v-model:visible="isCreateUserDialogVisible"
            modal
            @hide="resetForm()"
            header="เพิ่มสมาชิก"
            :style="{ width: '40vw' }"
            :breakpoints="{ '960px': '40vw', '641px': '100vw' }"
        >
            <form
                @submit.prevent="onSubmit"
                class="w-full px-0 mx-auto bg-white lg:max-w-xl lg:px-8 pt-7"
            >
                <div class="grid gap-4 lg:grid-cols-2">
                    <div class="mt-6">
                        <div class="p-float-label">
                            <InputText
                                id="firstname"
                                v-model="firstname"
                                :class="{ 'p-invalid': firstnameErrorMessage }"
                                placeholder="กรุณาใส่ชื่อจริง"
                                class="w-full"
                            />
                            <label for="firstname">ชื่อจริง*</label>
                        </div>
                        <small
                            class="mt-2 text-pink-500 font-extralight p-error"
                            v-if="firstnameErrorMessage"
                        >{{ firstnameErrorMessage }}</small>
                    </div>
                    <div class="mt-6">
                        <div class="p-float-label">
                            <InputText
                                id="surname"
                                v-model="surname"
                                :class="{ 'p-invalid': surnameErrorMessage }"
                                placeholder="กรุณาใส่นามสกุล"
                                class="w-full"
                            />
                            <label for="surname">นามสกุล*</label>
                        </div>
                        <small
                            class="mt-2 text-pink-500 font-extralight p-error"
                            v-if="surnameErrorMessage"
                        >{{ surnameErrorMessage }}</small>
                    </div>
                </div>
                <div class="mt-6">
                    <div class="p-float-label">
                        <InputText
                            id="address"
                            v-model="address"
                            :class="{ 'p-invalid': addressErrorMessage }"
                            placeholder="กรุณาใส่ที่อยู่"
                            class="w-full"
                        />
                        <label for="address">ที่อยู่ปัจจุบัน*</label>
                    </div>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="addressErrorMessage"
                    >{{ addressErrorMessage }}</small>
                </div>
                <div class="mt-6">
                    <div class="p-float-label">
                        <InputText
                            id="tel"
                            v-model="tel"
                            :class="{ 'p-invalid': telErrorMessage }"
                            placeholder="กรุณาใส่เบอร์ติดต่อ"
                            class="w-full"
                        />
                        <label for="address">เบอร์ติดต่อ</label>
                    </div>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="telErrorMessage"
                    >{{ telErrorMessage }}</small>
                </div>
                <div class="mt-6">
                    <div class="p-float-label">
                        <InputMask
                            id="citizenId"
                            v-model="citizenId"
                            mask="9-9999-99999-9-99"
                            :class="{ 'p-invalid': citizenIdErrorMessage }"
                            placeholder="กรุณาใส่เลขบัตรประจำตัวประชาชน 13 หลัก"
                            class="w-full"
                        />
                        <label for="citizenId">เลขบัตรประจำตัวประชาชน</label>
                    </div>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="citizenIdErrorMessage"
                    >{{ citizenIdErrorMessage }}</small>
                </div>
                <div class="mt-6">
                    <div class="p-float-label">
                        <Dropdown
                            v-model="role"
                            :options="rolesList"
                            optionValue="value"
                            optionLabel="label"
                            placeholder="เลือกตำแหน่ง"
                            class="w-full md:w-[200px]"
                            @change="() => resetField()"
                        />
                        <label for="role">สิทธิ์</label>
                    </div>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="roleErrorMessage"
                    >{{ roleErrorMessage }}</small>
                </div>
                <div
                    v-show="role === 'ADMIN'"
                    class="mt-8"
                >
                    <div class="p-float-label">
                        <InputText
                            id="username"
                            v-model="username"
                            :class="{ 'p-invalid': usernameErrorMessage }"
                            placeholder="กรุณาใส่ชื่อผู้ใช้งาน เช่น A001"
                            class="w-full"
                        />
                        <label for="username">ชื่อผู้ใช้* (ภาษาอังกฤษ หรือตัวเลข)</label>
                    </div>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="usernameErrorMessage"
                    >{{ usernameErrorMessage }}</small>
                </div>
                <div
                    v-show="role === 'ADMIN'"
                    :key="'passwordinput'"
                >
                    <div class="mt-6 p-float-label">
                        <Password
                            id="password"
                            v-model="password"
                            :class="{ 'p-invalid': passwordErrorMessage }"
                            placeholder="กรุณาใส่รหัสผ่าน เฉพาะเจ้าหน้าที่เข้าสู่ระบบ"
                            class="w-full"
                            input-class="w-full"
                            :feedback="false"
                            toggleMask
                            autocomplete="off"
                        />
                        <label for="password">รหัสผ่าน</label>
                    </div>
                    <small
                        class="mt-2 text-pink-500 font-extralight p-error"
                        v-if="passwordErrorMessage"
                    >{{ passwordErrorMessage }}</small>
                </div>
                <div class="flex justify-end mt-8">
                    <Button
                        icon="pi pi-plus"
                        type="submit"
                        label="เพิ่มสมาชิก"
                        :loading="loadingCreateUser"
                    ></Button>
                </div>
            </form>
        </Dialog>
    </div>
</template>
