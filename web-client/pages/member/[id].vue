<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { useField, useForm } from 'vee-validate'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import {
  deleteUserService,
  getUserProfileByIdService,
  updateUserService,
} from '~/services/user'
import {
  createAccountService,
  getAccountTypesService,
} from '~/services/account'
import { type AccountType, mapAccoutType } from '~/utils/account'
import type { UpdateUser } from '~/utils/user'
import { mapRole } from '~/utils/roles'
import { mapMonthToNo, mapNoToMonth } from '~/utils/brithdate'

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
const { strToCurrency } = useNumber()

const breadcrumbItems = ref<MenuItem[]>([])
const profile = ref<User>()

async function getUserProfile() {
  const { isSuccess, data, error } = await getUserProfileByIdService(+id)
  if (isSuccess && data) {
    breadcrumbItems.value = [
      {
        label: 'สมาชิก',
        to: '/member',
        icon: 'pi pi-user',
        class: '[&_.p-menuitem-text]:ml-2',
      },
      {
        label: `${data.username ? `(${data.username})` : ''} ${
          data.firstname || ''
        } (${id})`,
      },
    ]
    profile.value = data
    profile.value.createdAt = dayjs(data.createdAt).format(
      'ddd DD MMMM YYYY เวลา HH:mm:ss',
    )
    profile.value.roleTH = mapRole(data.role).th

    if (data.brithday) {
      const [d, m, y] = data.brithday.split('/')
      days.value = +d || null
      month.value = m === 'null' ? null : mapNoToMonth(+m, 'th')
      year.value = y ? +y : null
      profile.value.brithday = data.brithday.replaceAll('null', 'ไม่พบข้อมูล')
    }

    if (data.accountId) {
      data.accountId.forEach((item) => {
        accounts.value.forEach((acc) => {
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
}
const { handleSubmit } = useForm()
const updateLoading = ref(false)
const onSubmit = handleSubmit(async (values) => {
  console.warn(values)
  updateLoading.value = true
  const template: UpdateUser = {}
  if (values.citizenId) {
    template.citizenId = values.citizenId.replaceAll('-', '')
  }
  if (values.role) {
    template.role = values.role
  }
  if (values.firstname) {
    template.firstname = values.firstname
  }
  if (values.surname) {
    template.surname = values.surname
  }
  if (values.address) {
    template.address = values.address
  }
  if (values.tel) {
    template.tel = values.tel
  }
  if (values.customerId) {
    template.customerId = values.customerId
  }
  if (values.days || values.month || values.year) {
    template.brithday = `${values.days || null}/${
      mapMonthToNo(values.month, 'th') || null
    }/${values.year || null}`
  }

  const { isSuccess, data, error } = await updateUserService(+id, template)
  if (isSuccess && data) {
    toast.add({
      severity: 'success',
      summary: 'แก้ไขข้อมูล',
      detail: 'แก้ไขข้อมูลสมาชิกสำเร็จ',
      life: 5000,
    })
    getUserProfile()
    onEdit()
  }
  else {
    const err = (error as any).data.message || (error as any).statusMessage
    toast.add({
      severity: 'warn',
      summary: 'แก้ไขข้อมูล',
      detail: `แก้ไขข้อมูลไม่สำเร็จ ${err}`,
      life: 5000,
    })
  }
  updateLoading.value = false
})

const accounts = ref<
  {
    type: AccountType
    label: string
    isOpen: boolean
    id: number
    userId: number
    balance?: string
    color: string
  }[]
>([])
async function getAccountTypes() {
  const { isSuccess, data, error } = await getAccountTypesService()
  if (isSuccess && data) {
    // console.log(data)
    accounts.value = data.map((type: AccountType) => {
      return {
        type,
        label: mapAccoutType(type).th,
        isOpen: false,
        color: mapAccoutType(type).color,
      }
    })
  }

  return data
}

async function onAccountClick(
  accountID: number,
  type: AccountType,
  isOpen: boolean,
) {
  if (!isOpen) {
    return
  }

  router.push({
    path: `/account/${accountID}`,
    query: {
      userId: id,
    },
  })
}

async function createAccount(user_id: number, type: string) {
  confirm.require({
    message: 'ยืนยันการเปิดบัญชี',
    header: 'ยืนยัน',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      const { isSuccess, data, error } = await createAccountService(
        user_id,
        type,
      )
      if (isSuccess && data) {
        // console.log(data)
        toast.add({
          severity: 'success',
          summary: 'สร้างบัญชี',
          detail: 'สร้างบัญชีสำเร็จ',
          life: 5000,
        })
        getUserProfile()
      }
      return data
    },
  })
}

const rolesList = ref(roles)

const isEdit = ref(false)
function onEdit() {
  isEdit.value = !isEdit.value
  if (isEdit.value && profile.value) {
    citizenId.value = profile.value.citizenId
    role.value = profile.value.role
    firstname.value = profile.value.firstname || ''
    surname.value = profile.value.surname || ''
    address.value = profile.value.address || ''
    tel.value = profile.value.tel || ''
    customerId.value = profile.value.customerId || ''
  }
}
const { value: citizenId, errorMessage: citizenIdErrorMessage } = useField<
  string | undefined
>('citizenId', toTypedSchema(z.string().nullish()), {
  initialValue: '',
})
const { value: role, errorMessage: roleErrorMessage } = useField(
  'role',
  toTypedSchema(
    z.string().nonempty({
      message: 'ต้องใส่สิทธิ์',
    }),
  ),
  {
    initialValue: '',
  },
)

const { value: firstname, errorMessage: firstnameErrorMessage } = useField<
  string | undefined
>(
  'firstname',
  toTypedSchema(
    z.string().nonempty({
      message: 'ต้องใส่ชื่อ',
    }),
  ),
  {
    initialValue: '',
  },
)
const { value: surname, errorMessage: surnameErrorMessage } = useField<
  string | undefined
>(
  'surname',
  toTypedSchema(
    z.string().nonempty({
      message: 'ต้องใส่นามสกุล',
    }),
  ),
  {
    initialValue: '',
  },
)
const { value: address, errorMessage: addressErrorMessage } = useField<
  string | undefined
>('address', undefined, {
  initialValue: '',
})
const { value: tel, errorMessage: telErrorMessage } = useField(
  'tel',
  toTypedSchema(
    z
      .string({
        description: '',
      })
      .max(16),
  ),
  {
    initialValue: '',
  },
)

const { value: customerId, errorMessage: customerIdErrorMessage } = useField<
  string | undefined
>(
  'customerId',
  toTypedSchema(
    z
      .string({
        description: '',
      })
      .max(16),
  ),
  {
    initialValue: '',
  },
)

const daysList = ref(getDay())
const monthList = ref(monthLists.th)
const yearList = ref(getYear({ isBudda: true }))

const { value: days, errorMessage: daysErrorMessage } = useField<number | null>(
  'days',
  undefined,
  {
    initialValue: null,
  },
)
const { value: month, errorMessage: monthErrorMessage } = useField<
  string | null
>('month', undefined, {
  initialValue: null,
})
const { value: year, errorMessage: yearErrorMessage } = useField<number | null>(
  'year',
  undefined,
  {
    initialValue: null,
  },
)

function deleteUser(user_id: number) {
  confirm.require({
    header: 'ยืนยัน',
    message:
      '##### ยืนยันการลบสมาชิก ##### \n- ข้อมูลทั่วไป \n- ข้อมูลบัญชี \n- ประวัติการฝาก-ถอน \nจะถูกลบทั้งหมด',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'ใช่, ยืนยัน',
    rejectLabel: 'ไม่',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const { isSuccess, data, error } = await deleteUserService(user_id)
      if (isSuccess && data) {
        // console.log(data)
        toast.add({
          severity: 'success',
          summary: 'ลบสมาชิก',
          detail: 'ลบสมาชิกสำเร็จ',
          life: 5000,
        })
        router.replace('/member')
      }
      return data
    },
  })
}

async function init() {
  await getAccountTypes()
  await getUserProfile()
}

init()
</script>

<template>
  <div class="px-8 py-4 h-[calc(100dvh_-_60px)] overflow-auto">
    <div class="">
      <Breadcrumb :model="breadcrumbItems" class="p-2">
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
    <h3 class="mt-8 flex gap-2 items-center">
      ข้อมูลทั่วไป <i class="cursor-pointer pi pi-pencil" @click="onEdit" />
      <IconsBin
        v-if="isEdit"
        class="cursor-pointer w-6 h-6 ml-auto text-red-500"
        @click="() => deleteUser(+id)"
      />
    </h3>

    <form
      v-if="profile"
      id="editForm"
      class="grid mt-4 sm:grid-cols-3 gap-y-2 sm:gap-y-4"
      @submit.prevent="onSubmit"
    >
      <div>
        <label for="">หมายเลขบัตรประจำตัวประชาชน</label>
        <div v-if="!isEdit" class="font-extralight">
          {{ profile.citizenId || "-" }}
        </div>
        <div v-else class="mt-2">
          <InputMask
            id="citizenId"
            v-model="citizenId"
            mask="9-9999-99999-99-9"
            :class="{ 'p-invalid': citizenIdErrorMessage }"
            placeholder="กรุณาใส่เลขบัตรประจำตัวประชาชน 13 หลัก"
            class="w-4/5 px-1 py-0"
          />
          <small
            v-if="citizenIdErrorMessage"
            class="block mt-2 text-pink-500 font-extralight p-error"
          >{{ citizenIdErrorMessage }}</small>
        </div>
      </div>
      <div>
        <label for="">ชื่อผู้ใช้</label>
        <div class="font-extralight">
          {{ profile.username || "-" }}
        </div>
      </div>
      <div>
        <label for="">สิทธิ์</label>
        <div v-if="!isEdit" class="font-extralight">
          {{ profile.role || "-" }}
        </div>
        <div v-else class="mt-2">
          <Dropdown
            v-model="role"
            :options="rolesList"
            option-value="value"
            option-label="label"
            placeholder="เลือกตำแหน่ง"
            class="w-full md:w-[200px] [&_.p-dropdown-label]:px-1 [&_.p-dropdown-label]:py-0"
          />
          <small
            v-if="roleErrorMessage"
            class="block mt-2 text-pink-500 font-extralight p-error"
          >{{ roleErrorMessage }}</small>
        </div>
      </div>
      <div>
        <label for="">ชื่อ-นามสกุล</label>
        <div v-if="!isEdit" class="font-extralight">
          {{ `${profile.firstname} ${profile.surname}` || "-" }}
        </div>
        <div v-else class="grid w-5/6 grid-cols-2 gap-4 mt-2">
          <div>
            <InputText
              id="firstname"
              v-model="firstname"
              :class="{ 'p-invalid': firstnameErrorMessage }"
              placeholder="ชื่อจริง"
              class="w-full px-1 py-0"
            />
            <small
              v-if="firstnameErrorMessage"
              class="block mt-2 text-pink-500 font-extralight p-error"
            >{{ firstnameErrorMessage }}</small>
          </div>
          <div>
            <InputText
              id="lastname"
              v-model="surname"
              :class="{ 'p-invalid': surnameErrorMessage }"
              placeholder="นามสกุล"
              class="w-full px-1 py-0"
            />
            <small
              v-if="surnameErrorMessage"
              class="block mt-2 text-pink-500 font-extralight p-error"
            >{{ surnameErrorMessage }}</small>
          </div>
        </div>
      </div>
      <div>
        <label for="">วันเกิด
          <span class="font-extralight">(วัน/เดือน/ปี พ.ศ.)</span></label>
        <div v-if="!isEdit" class="font-extralight">
          {{ profile.brithday || "-" }}
        </div>
        <div
          v-else
          class="grid w-4/5 grid-cols-1 gap-2 mt-2 md:grid-cols-2 2xl:grid-cols-3"
        >
          <Dropdown
            v-model="days"
            editable
            :options="daysList"
            placeholder="วัน"
            class="input-control"
          />
          <Dropdown
            v-model="month"
            editable
            :options="monthList"
            placeholder="เดือน"
            class="input-control"
          />
          <Dropdown
            v-model="year"
            editable
            :options="yearList"
            placeholder="ปี"
            class="input-control"
          />
        </div>
      </div>
      <div>
        <label for="">ที่อยู่</label>
        <div v-if="!isEdit" class="font-extralight">
          {{ profile.address || "-" }}
        </div>
        <div v-else class="mt-2">
          <InputText
            id="address"
            v-model="address"
            :class="{ 'p-invalid': addressErrorMessage }"
            placeholder="กรุณาใส่ที่อยู่ตามบัตรประชาชน"
            class="w-4/5 px-1 py-0"
          />
          <small
            v-if="addressErrorMessage"
            class="block mt-2 text-pink-500 font-extralight p-error"
          >{{ addressErrorMessage }}</small>
        </div>
      </div>
      <div>
        <label for="">เบอร์ติดต่อ</label>
        <div v-if="!isEdit" class="font-extralight">
          {{ profile.tel || "-" }}
        </div>
        <div v-else class="mt-2">
          <InputText
            id="address"
            v-model="tel"
            :class="{ 'p-invalid': telErrorMessage }"
            placeholder="กรุณาใส่เบอร์โทรศัพท์"
            class="w-4/5 px-1 py-0"
          />
          <small
            v-if="telErrorMessage"
            class="block mt-2 text-pink-500 font-extralight p-error"
          >{{ telErrorMessage }}</small>
        </div>
      </div>
      <div>
        <label for="">เลขทะเบียน</label>
        <div v-if="!isEdit" class="font-extralight">
          {{ profile.customerId || "-" }}
        </div>
        <div v-else class="mt-2">
          <InputText
            id="address"
            v-model="customerId"
            :class="{ 'p-invalid': customerIdErrorMessage }"
            placeholder="กรุณาใส่เลขทะเบียนสมาชิก ไม่ซ้ำกับสมาชิกท่านอื่น"
            class="w-4/5 px-1 py-0"
          />
          <small
            v-if="customerIdErrorMessage"
            class="block mt-2 text-pink-500 font-extralight p-error"
          >{{ customerIdErrorMessage }}</small>
        </div>
      </div>
      <div>
        <label for="">สร้างเมื่อ</label>
        <div class="font-extralight">
          {{ profile.createdAt || "" }}
        </div>
      </div>
    </form>
    <div v-if="isEdit" class="flex gap-2 mt-4">
      <Button
        form="editForm"
        type="submit"
        size="small"
        :loading="updateLoading"
      >
        บันทึกข้อมูล
      </Button>
      <Button type="submit" size="small" outlined @click="onEdit">
        ยกเลิก
      </Button>
    </div>
    <div class="mt-4">
      <div class="flex gap-8">
        <h3 class="m-0">
          ประเภทบัญชี
        </h3>
        <!-- <Button @click="isCreateAccountDialogVisible = true" class="" icon="pi pi-plus" size="small" label="เปิดบัญชี"></Button> -->
      </div>
      <div
        v-if="profile"
        class="mt-4 grid md:grid-cols-[210px_210px_210px] lg:grid-cols-[210px_210px_210px] xl:grid-cols-[260px_260px_260px] gap-8"
      >
        <div
          v-for="accountCard in accounts"
          :key="accountCard.id"
          class="w-full text-white h-[100px] md:h-[150px] shadow-md rounded-md flex items-center justify-center flex-col gap-2 cursor-pointer hover:scale-105 transition-all duration-300"
          :style="{
            background: accountCard.color,
          }"
          @click="
            () =>
              onAccountClick(
                accountCard.id,
                accountCard.type,
                accountCard.isOpen,
              )
          "
        >
          <p class="m-0 text-xl">
            {{ accountCard.label }}
          </p>
          <div v-if="accountCard.balance !== undefined">
            ({{ strToCurrency(accountCard.balance) }} บาท)
          </div>
          <Button
            v-if="!accountCard.isOpen"
            class=""
            icon="pi pi-plus"
            size="small"
            label="เปิดบัญชี"
            @click.stop="() => createAccount(+id, accountCard.type)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.input-control > .p-inputtext {
  padding: 4px 2px;
}
</style>
