<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useAuthStore } from '~/stores/auth'
import Cookies from 'js-cookie';
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: 'login'
})

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
const loading = ref(false)
const errorMsg = ref('')
const onSubmit = handleSubmit(async (values) => {
  // console.log(JSON.stringify(values, null, 2));
  loading.value = true;
  errorMsg.value = ''
  const { isSuccess, data, error } = await loginByUsernameService(values.username, values.password);
  if (isSuccess && data) {
    authStore.$patch({
      accessToken: data.access_token,
      isAuthenticated: true,
    })
    router.replace({
      path: '/home'
    })
    Cookies.set('accessToken', data.access_token, {
      secure: true,
      sameSite: 'strict',
      expires: new Date(data.expire * 1000),
    })
    toast.add({ severity: 'success', summary: 'เข้าสู่ระบบ', detail: 'การเข้าสู่ระบบสำเร็จ', life: 5000 });
    loading.value = false;
  } else {
    const err = (error as any).statusMessage
    const detailError = 'การเข้าสู่ระบบไม่สำเร็จ ชื่อผู้ใช้ / รหัสผ่าน ไม่ถูกต้อง กรุณาลองใหม่\n' + 'system message : ' + err
    errorMsg.value = detailError
    toast.add({ severity: 'warn', summary: 'เข้าสู่ระบบไม่สำเร็จ', detail: detailError, life: 8000 })
    loading.value = false;
  }

});

const username = defineComponentBinds('username')
const password = defineComponentBinds('password')



</script>

<template>
  <div class="flex h-full">
    <div class="relative flex-1 hidden overflow-hidden bg-slate-200 lg:block aspect-square">
      <img
        loading="lazy"
        src="/images/bg-login.webp"
        class="w-full h-full"
        alt="bg"
      >
      <h1
        class="absolute w-[600px] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] text-primary lg:text-4xl text-2xl text-center bg-white p-4 rounded-lg"
      >ธนาคารหมู่บ้านตามแนวพระราชดำริ <br> <span class="text-black font-extralight">(สาขา บ้านกุดโดน)</span> </h1>
    </div>
    <div class="flex flex-col items-center justify-center flex-none w-full gap-2 p-4 xl:w-1/2 lg:gap-6 bg-slate-100">
      <form
        @submit.prevent="onSubmit"
        class="w-full px-4 py-10 bg-white border border-gray-300 border-solid shadow-lg md:max-w-xl rounded-3xl lg:px-8"
      >
        <div>
          <h1 class="m-0 text-2xl text-center">เข้าสู่ระบบเจ้าหน้าที่</h1>
          <h4 class="m-0 mt-2 text-lg text-center text-primary">ธนาคารหมู่บ้านตามแนวพระราชดำริ <br> <span
              class="text-black font-extralight"
            >(สาขา บ้านกุดโดน)</span></h4>
        </div>
        <small
          class="block mt-2 text-center text-pink-500 font-extralight p-error"
          v-if="errorMsg"
        >{{ errorMsg }} <i @click="errorMsg = ''" class="text-sm text-black cursor-pointer pi pi-times-circle"></i></small>
        <div class="mt-8 p-float-label">
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
          class="mt-2 text-pink-500 font-extralight p-error"
          v-if="errors.username"
        >{{ errors.username }}</small>
        <div class="mt-8 p-float-label">
          <Password
            v-bind="password"
            inputClass="w-full"
            :class="{ 'p-invalid': errors.password }"
            class="w-full"
            placeholder="กรุณาใส่รหัสผ่าน"
            :feedback="false"
            toggleMask
            autocomplete="current-password"
          />
          <label for="password">รหัสผ่าน</label>
        </div>
        <small
          class="mt-2 text-pink-500 font-extralight p-error"
          v-if="errors.password"
        >{{ errors.password }}</small>
        <div class="flex justify-center mt-4">
          <Button
            type="submit"
            :loading="loading"
            class="w-full max-w-[200px] flex justify-center px-[2.5rem]"
            label="เข้าสู่ระบบ"
          ></Button>
        </div>
      </form>
    </div>
  </div>
</template>
