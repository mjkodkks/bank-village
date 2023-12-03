<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { getProfileService } from '~/services/user';
import { useAuthStore } from '~/stores/auth';
import { useMainStore } from '~/stores/main';
// import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

// const breakpoints = useBreakpoints(breakpointsTailwind)
// const isMobile = breakpoints.smallerOrEqual('sm')

const router = useRouter()
const toast = useToast()

const mainStore = useMainStore()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.replace({
    path: '/',
    query: {
      t: new Date().getTime()
    }
  })
  toast.add({ severity: 'success', summary: 'ออกจากระบบ', detail: 'ออกจากระบบสำเร็จ', life: 3000 });
}

const { isSuccess, data, error } = await getProfileService()
if (isSuccess && data) {
  mainStore.$patch({
    username: data.username,
    firstname: data.firstname,
    surname: data.surname,
    id: data.id
  })
}

</script>


<template>
  <div class="grid grid-cols-1 lg:grid-cols-[230px_1fr] h-full">
    <Sidebar v-model:visible="mainStore.isSidebarOpen">
      <h1 class="flex-none text-center">ธนาคารหมู่บ้าน</h1>
      <SidebarMenu></SidebarMenu>
      <div class="bottom-1.5 w-full p-2 absolute">
        <Button
          @click="logout"
          class="w-full"
          outlined
        >ออกจากระบบ</Button>
      </div>
    </Sidebar>
    <aside class="shadow-lg h-[100vh] relative hidden lg:flex flex-col gap-1">
      <h1 class="flex-none text-center">ธนาคารหมู่บ้าน</h1>
      <SidebarMenu></SidebarMenu>
      <div class="bottom-1.5 left-0 w-full p-2 flex-none mt-auto">
        <Button
          @click="logout"
          class="w-full"
          outlined
        >ออกจากระบบ</Button>
      </div>
    </aside>
    <main
      class="overflow-hidden"
      id="main"
    >
    <Navbar
      :username="mainStore.username"
      :fullname="mainStore.fullname"
      @toggleSidebar="mainStore.isSidebarOpen = !mainStore.isSidebarOpen"
    ></Navbar>
    <slot />
  </main>
</div></template>
