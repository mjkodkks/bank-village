<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useAuthStore } from '~/stores/auth'
import Cookies from 'js-cookie';
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const router = useRouter()


const { errors, handleSubmit, defineComponentBinds } = useForm({
  initialValues: {
    username: '',
    password: '',
  },
  validationSchema: toTypedSchema(
    z.object({
      username: z.string().nonempty({
        message: 'ต้องใส่ชื่อผู้ใช้งาน'
      }),
      password: z.string().nonempty({
        message: 'ต้องใส่รหัสผ่าน'
      }),
    }),
  )
});

const authStore = useAuthStore()

const onSubmit = handleSubmit(async (values) => {
  console.log(JSON.stringify(values, null, 2));
  const { pending, isSuccess, data, error } = await loginByUsername(values.username, values.password);
  console.log(pending.value, data);
  if (isSuccess && data) {
    console.log(data)
    authStore.$patch({
      accessToken: data.access_token,
    })
    router.replace({
      path: '/home'
    })
    Cookies.set('accessToken', data.access_token, {
      secure: true,
      sameSite: 'strict',
      expires: new Date(data.expire * 1000),
    })
    toast.add({ severity: 'success', summary: 'เข้าสู่ระบบ', detail: 'การเข้าสู่ระบบสำเร็จ', life: 3000 });
  }

});

const username = defineComponentBinds('username')
const password = defineComponentBinds('password')



</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 bg-slate-200 overflow-hidden relative hidden lg:block aspect-square">
      <img
        src="/images/bg-login.jpg"
        class="w-full h-full"
        alt="bg"
      >
      <h1
        class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] text-primary lg:text-4xl text-2xl text-center bg-white p-4 rounded-lg"
      >ธนาคารหมู่บ้านตามแนวพระราชดำริ</h1>
    </div>
    <div class="flex-none w-full xl:w-1/2 p-4 flex flex-col gap-2 lg:gap-4 justify-center items-center bg-slate-100">
      <h1 class="text-center text-2xl">เข้าสู่ระบบพนักงาน</h1>
      <form
        @submit.prevent="onSubmit"
        class="md:max-w-xl rounded-lg shadow-lg pt-10 pb-5 lg:px-8 px-4 w-full border-solid border border-gray-300 bg-white"
      >
        <div class="p-float-label">
          <InputText
            id="username"
            name="username"
            v-bind="username"
            :class="{ 'p-invalid': errors.username }"
            placeholder="กรุณาใส่ชื่อผู้ใช้งาน"
            class="w-full"
          />
          <label for="username">ชื่อผู้ใช้</label>
        </div>
        <small
          class="text-pink-500 font-extralight mt-2 p-error"
          v-if="errors.username"
        >{{ errors.username }}</small>
        <div class="p-float-label mt-8">
          <Password
            v-bind="password"
            inputClass="w-full"
            :class="{ 'p-invalid': errors.password }"
            class="w-full"
            placeholder="กรุณาใส่รหัสผ่าน"
            :feedback="false"
            toggleMask
          />
          <label for="password">รหัสผ่าน</label>
        </div>
        <small
          class="text-pink-500 font-extralight mt-2 p-error"
          v-if="errors.password"
        >{{ errors.password }}</small>
        <div class="flex justify-center mt-8">
          <Button type="submit">เข้าสู่ระบบ</Button>
      </div>
    </form>
  </div>
</div></template>
