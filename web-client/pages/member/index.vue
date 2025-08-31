<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FilterMatchMode } from 'primevue/api'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'
import { createUserService } from '~/services/user'
import { roles } from '~/utils/roles'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const toast = useToast()
const router = useRouter()
const dayjs = useDayjs()
const confirm = useConfirm()

function rowClick({ data }: any) {
  // console.log(data)
  const { id } = data
  router.push({
    path: `/member/${id}`,
  })
}

const rolesList = ref(roles)

const { handleSubmit, resetForm } = useForm()

const { value: citizenId, errorMessage: citizenIdErrorMessage } = useField<string | undefined>('citizenId', toTypedSchema(z.string().nullish()), {
  initialValue: '',
})
const { value: firstname, errorMessage: firstnameErrorMessage, resetField: firstnameResetField } = useField('firstname', toTypedSchema(z.string().nonempty({
  message: 'กรุณาใส่ชื่อจริง',
})), {
  initialValue: '',
})
const { value: surname, errorMessage: surnameErrorMessage } = useField('surname', toTypedSchema(z.string().nonempty({
  message: 'กรุณาใส่นามสกุล',
})), {
  initialValue: '',
})
const { value: tel, errorMessage: telErrorMessage } = useField('tel', toTypedSchema(z.string({
  description: '',
}).max(16)), {
  initialValue: '',
})
const { value: address, errorMessage: addressErrorMessage, resetField: addressResetField } = useField('address', toTypedSchema(z.string().nonempty({
  message: 'กรุณาใส่ที่อยู่',
})), {
  initialValue: '',
})

const noSpecialCharSchema = z.string().regex(/^[a-z0-9]+$/i, {
  message: 'กรุณาใส่ตัวอักษรภาษาอังกฤษ หรือตัวเลขเท่านั้น',
})
const { value: customerId, errorMessage: customerIdErrorMessage, resetField: customerIdResetField } = useField('customerId', toTypedSchema(noSpecialCharSchema), {
  initialValue: '',
})

const { value: role, errorMessage: roleErrorMessage } = useField('role', toTypedSchema(z.string().nonempty({
  message: 'กรุณาใส่ตำแหน่ง',
})), {
  initialValue: 'USER',
})

const { value: username, errorMessage: usernameErrorMessage } = useField('username', validateFieldUsername, {
  initialValue: '',
})

const { value: password, errorMessage: passwordErrorMessage, resetField } = useField('password', validateFieldPassword, {
  initialValue: '',
})

function validateFieldUsername(value: any) {
  if (role.value === 'ADMIN') {
    if (!value) {
      return 'กรุณาใส่ชื่อ Username'
    }
  }

  return true
}
function validateFieldPassword(value: any) {
  if (role.value === 'ADMIN') {
    if (!value) {
      return 'กรุณาใส่รหัสผ่าน'
    }
  }

  return true
}

const loadingCreateUser = ref(false)
const onSubmit = handleSubmit(async (values) => {
  const { username, citizenId, customerId, role, password, firstname, surname, address, tel } = values as CreateUser
  const isAdmin = role === 'ADMIN'

  confirm.require({
    message: `ยืนยันการสร้าง${isAdmin ? 'เจ้าหน้าที่' : 'สมาชิก'}`,
    header: 'ยืนยัน',
    acceptLabel: 'ใช่, ยืนยัน',
    rejectLabel: 'ไม่',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      loadingCreateUser.value = true
      try {
        const { isSuccess, data, error } = await createUserService({
          username: isAdmin ? username : undefined,
          password: isAdmin ? password : undefined,
          citizenId,
          customerId,
          role,
          address,
          firstname,
          surname,
          tel,
        })

        if (isSuccess && data) {
          toast.add({ severity: 'success', summary: 'สร้างสมาชิก', detail: 'สร้างสมาชิกสำเร็จ', life: 5000 })
          fetchUser() // <- ตรวจ spelling ด้วยนะครับ
        }
        else {
          console.error(error)
          const message = (error as any).data?.message || 'สร้างสมาชิกไม่สำเร็จ'
          toast.add({ severity: 'error', summary: 'สร้างสมาชิกไม่สำเร็จ ', detail: message, life: 10000 })
        }

        isCreateUserDialogVisible.value = false
      }
      finally {
        loadingCreateUser.value = false
      }
    },
    onHide: () => {
      loadingCreateUser.value = false
    },
  })
})

const isCreateUserDialogVisible = ref(false)

const users = ref<User[]>([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const checkedCustomerIdOnly = ref(false)

const filterListCompute = computed(() => {
  if (checkedCustomerIdOnly.value) {
    return ['customerId']
  }
  else {
    return ['id', 'name', 'customerId', 'username', 'role']
  }
})

const userLoading = ref(false)
async function fetchUser() {
  userLoading.value = true
  const { isSuccess, data, error } = await getlistUserService()
  if (isSuccess && data) {
    // console.log(isSuccess)
    users.value = data.map((m) => {
      return {
        ...m,
        name: `${m.firstname} ${m.surname}`,
        createdAt: dayjs(m.createdAt).format('DD/MM/YYYY HH:mm'),
        role: mapRole(m.role).th,
      }
    })
  }
  setTimeout(() => {
    userLoading.value = false
  }, 500)
  return data
}

const usersCount = computed(() => users.value && users.value.length)

function init() {
  fetchUser()
}

init()
</script>

<template>
  <div class="h-[calc(100dvh_-_60px)] px-2 md:px-6 xl:px-8 py-4 flex flex-col">
    <h1 class="my-0">
      สมาชิก / ค้นหาสมาชิก
    </h1>
    <div>
      <hr class="border border-gray-200 border-solid">
    </div>
    <div class="flex gap-4 mt-4 header">
      <div class="flex justify-content-end">
        <IconField icon-position="left">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters.global.value"
            placeholder="ค้นหาสมาชิกที่นี้"
          />
        </IconField>
      </div>
      <div class="flex items-center">
        <Checkbox
          v-model="checkedCustomerIdOnly" input-id="checkboxCustomerId"
          name="checkboxCustomerId"
          binary @change="() => { filters.global.value = null }"
        />
        <label for="checkboxCustomerId" class="ml-2"> ค้นเฉพาะข้อมูลเลขทะเบียน </label>
      </div>
      <div class="ml-auto">
        <Button
          icon="pi pi-user-plus"
          label="เพิ่มสมาชิก"
          @click="isCreateUserDialogVisible = true"
        />
      </div>
    </div>
    <div v-if="users" class="mt-4">
      จำนวนสมาชิก ({{ usersCount }})
    </div>
    <div class="flex-1 mt-4 overflow-hidden table-wrapper">
      <template v-if="!userLoading">
        <DataTable
          v-model:filters="filters"
          :value="users"
          striped-rows
          scrollable
          scroll-height="flex"
          class="text-sm p-datatable-sm row-selected"
          table-style="min-width: 50rem"
          :global-filter-fields="filterListCompute"
          selection-mode="single"
          @row-click="rowClick"
        >
          <Column field="id" header="รหัสในระบบ" />
          <Column field="customerId" header="เลขทะเบียน">
            <template #body="{ data }">
              {{ data.customerId || "-" }}
            </template>
          </Column>
          <Column field="username" header="ชื่อผู้ใช้งาน">
            <template #body="{ data }">
              {{ data.username || "-" }}
            </template>
          </Column>
          <Column field="name" header="ชื่อ นามสกุล">
            <template #body="{ data }">
              <span class="underline text-primary hover:text-pink-600">{{
                data.name || "-"
              }}</span>
            </template>
          </Column>
          <Column field="address" header="ที่อยู่" />
          <Column field="tel" header="เบอร์โทรศํพท์">
            <template #body="{ data }">
              {{ data.tel || "-" }}
            </template>
          </Column>
          <Column field="citizenId" header="เลขบัตรประจำตัวประชาชน">
            <template #body="{ data }">
              {{ data.citizenId || "-" }}
            </template>
          </Column>
          <Column field="role" header="ตำแหน่ง" />
          <Column field="createdAt" header="เริ่มใช้งาน" />
        </DataTable>
      </template>
      <template v-else>
        <TableLoading :cols="7" :rows="8" />
      </template>
    </div>
    <Dialog
      v-model:visible="isCreateUserDialogVisible"
      modal
      header="เพิ่มสมาชิก"
      :breakpoints="{
        '1440px': '40vw',
        '1024px': '60vw',
        '820px': '80vw',
        '400px': '90vw',
      }"
      @hide="resetForm()"
    >
      <form
        class="w-full px-0 mx-auto bg-white lg:max-w-xl lg:px-8"
        @submit.prevent="onSubmit"
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
              v-if="firstnameErrorMessage"
              class="mt-2 text-pink-500 font-extralight p-error"
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
              v-if="surnameErrorMessage"
              class="mt-2 text-pink-500 font-extralight p-error"
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
            v-if="addressErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
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
            v-if="telErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ telErrorMessage }}</small>
        </div>
        <div class="mt-6">
          <div class="p-float-label">
            <InputMask
              id="citizenId"
              v-model="citizenId"
              mask="9-9999-99999-99-9"
              :class="{ 'p-invalid': citizenIdErrorMessage }"
              placeholder="กรุณาใส่เลขบัตรประจำตัวประชาชน 13 หลัก"
              class="w-full"
            />
            <label for="citizenId">เลขบัตรประจำตัวประชาชน</label>
          </div>
          <small
            v-if="citizenIdErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ citizenIdErrorMessage }}</small>
        </div>
        <div class="mt-6">
          <div class="p-float-label">
            <InputText
              id="customerId"
              v-model="customerId"
              :class="{ 'p-invalid': customerIdErrorMessage }"
              placeholder="กรุณาใส่เลขทะเบียนสมาชิก โดยไม่ซ้ำกับสมาชิกท่านอื่น"
              autocomplete="off"
              aria-autocomplete="none"
              class="w-full"
            />
            <label for="customerId">เลขทะเบียนสมาชิก</label>
          </div>
          <small
            v-if="customerIdErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ customerIdErrorMessage }}</small>
        </div>
        <div class="mt-8">
          <div class="p-float-label">
            <Dropdown
              v-model="role"
              :options="rolesList"
              option-value="value"
              option-label="label"
              placeholder="เลือกตำแหน่ง"
              class="w-full md:w-[200px]"
              @change="() => resetField()"
            />
            <label for="role">สิทธิ์</label>
          </div>
          <small
            v-if="roleErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ roleErrorMessage }}</small>
        </div>
        <div v-show="role === 'ADMIN'" class="mt-8">
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
            v-if="usernameErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ usernameErrorMessage }}</small>
        </div>
        <div v-show="role === 'ADMIN'" key="passwordinput">
          <div class="mt-6 p-float-label">
            <Password
              id="password"
              v-model="password"
              :class="{ 'p-invalid': passwordErrorMessage }"
              placeholder="กรุณาใส่รหัสผ่าน เฉพาะเจ้าหน้าที่เข้าสู่ระบบ"
              class="w-full"
              input-class="w-full"
              :feedback="false"
              toggle-mask
              autocomplete="off"
            />
            <label for="password">รหัสผ่าน</label>
          </div>
          <small
            v-if="passwordErrorMessage"
            class="mt-2 text-pink-500 font-extralight p-error"
          >{{ passwordErrorMessage }}</small>
        </div>
        <div class="flex justify-end mt-8">
          <Button
            icon="pi pi-plus"
            type="submit"
            label="เพิ่มสมาชิก"
            :loading="loadingCreateUser"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>
