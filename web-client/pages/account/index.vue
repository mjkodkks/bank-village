<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useField, useForm } from 'vee-validate';
import { z } from 'zod'
import { getAccountListService } from '~/services/account';
import { createUserService } from '~/services/user';
import { roles } from '~/utils/roles'
definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})

const toast = useToast()
const router = useRouter()
const dayjs = useDayjs()

function rowClick({ data }: any) {
    console.log(data)
    const { id } = data
    router.push({
        path: `/member/${id}`
    })
}

const rolesList = ref(roles)

const { handleSubmit } = useForm();


const onSubmit = handleSubmit(async (values) => {

});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const accounts = ref<any>()
const accountLoading = ref(false)
async function fetchAccounts() {
    const { isSuccess, data, error } = await getAccountListService()
    if (isSuccess && data) {
        console.log(data)
        accounts.value = data
    }
}

const accountCount = computed(() => accounts && accounts.value.length)

function init() {
    fetchAccounts()
}

init()

</script>

<template>
    <div class="h-full px-2 md:px-6 xl:px-8 py-8 flex flex-col">
        <h1 class="mt-0">บัญชี / รวมบัญชีทั้งหมด</h1>
        <div>
            <hr class="border-gray-200 border border-solid" />
        </div>
        <div class="header flex gap-2 mt-8">
            <div class="flex justify-content-end">
                <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                        v-model="filters['global'].value"
                        placeholder="ค้นหาสมาชิกที่นี้"
                    />
                </span>
            </div>
            <!-- <div class="ml-auto">
                <Button
                    @click="isCreateUserDialogVisible = true"
                    icon="pi pi-user-plus"
                    label="เพิ่มสมาชิก"
                ></Button>
            </div> -->
        </div>
        <div
            v-if="accounts"
            class="mt-4"
        >
            จำนวนสมาชิก ({{ accountCount }})
        </div>
        <div
            class="table-wrapper mt-4 flex-1 overflow-hidden"
        >
            <template v-if="!accountLoading">
                <DataTable
                    :value="accounts"
                    stripedRows
                    scrollable scrollHeight="flex"
                    class="p-datatable-sm text-sm"
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
                        field="type"
                        header="ประเภท"
                    ></Column>
                    <Column
                        field="balance"
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

    </div>
</template>
