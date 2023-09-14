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
const { strToCurrency } = useNumber()

function rowClick({ data }: any) {
    // console.log(data)
    const { id, userId } = data
    router.push({
        path: `/account/${id}`,
        query: {
            userId: userId
        }
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
    accountLoading.value = true;
    const { isSuccess, data, error } = await getAccountListService()
    if (isSuccess && data) {
        // console.log(data)
        accounts.value = data.map(m => {
            return {
                ...m,
                firstname: m.owner?.firstname,
                username: m.owner?.username,
                surname: m.owner?.surname,
                createdAt: dayjs(m.createdAt).format('DD/MM/YYYY HH:mm'),
            }
        })
        // console.log(accounts.value);
        
    }
    setTimeout(() => {
        accountLoading.value = false
    }, 500);
}

const accountCount = computed(() => accounts && accounts.value.length)

function init() {
    fetchAccounts()
}

init()

</script>

<template>
    <div class="h-[calc(100%_-_60px)] px-2 md:px-6 xl:px-8 py-8 flex flex-col">
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
            จำนวนบัญชี ({{ accountCount }})
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
                    :globalFilterFields="['name', 'id', 'type', 'balance', 'interest', 'username', 'firstname', 'surname']"
                    @row-click="rowClick"
                    selectionMode="single"
                >
                    <Column
                        field="id"
                        header="เลขที่บัญชี"
                    ></Column>
                    <Column
                        field="type"
                        header="ประเภท"
                    ></Column>
                    <Column
                        field="balance"
                        header="ยอดสุทธิ (บาท)"
                    >
                    <template #body="{ data }">
                      {{ strToCurrency(data.balance) || '0' }}
                    </template>
                </Column>
                    <Column
                        field="interest"
                        header="ดอกเบี้ย (บาท)"
                    ></Column>
                    <Column
                        field="owner"
                        header="เจ้าของบัญชี"
                    >
                        <template #body="{ data }">
                            {{ data.owner?.username ? `(${data.owner?.username}) ` : '' }} {{ data.owner?.firstname || '' }} {{ data.owner?.surname || '' }}
                        </template>
                    </Column>
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
