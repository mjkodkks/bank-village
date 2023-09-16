<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { getProfileService } from '~/services/user';
import { useAuthStore } from '~/stores/auth';
import { useMainStore } from '~/stores/main';

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
  })
}

</script>


<template>
  <div class="grid md:grid-cols-[230px_1fr] 2xl:grid-cols-[280px_1fr] h-full">
    <aside class="shadow-lg h-[100vh] relative hidden md:flex flex-col gap-1">
      <Sidebar v-model:visible="mainStore.isSidebarOpen">
        <h1 class="flex-none text-center">ธนาคารหมู่บ้าน</h1>
         <SidebarMenu></SidebarMenu>
      </Sidebar>
      <h1 class="flex-none text-center">ธนาคารหมู่บ้าน</h1>
      <SidebarMenu></SidebarMenu>
      <div class=" bottom-1.5 w-full p-2 flex-none mt-auto">
            <Button @click="logout" class="w-full" outlined>ออกจากระบบ</Button>
      </div>
    </aside>
    <main class="overflow-hidden" id="main">
      <Navbar :username="mainStore.username" :fullname="mainStore.fullname"></Navbar>
      <slot />
    </main>
  </div>
</template>
