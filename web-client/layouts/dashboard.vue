<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { getProfileService } from '~/services/user'
import { useAuthStore } from '~/stores/auth'
import { useMainStore } from '~/stores/main'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const mainStore = useMainStore()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.replace({
    path: '/',
    query: {
      t: new Date().getTime(),
    },
  })
  toast.add({ severity: 'success', summary: 'ออกจากระบบ', detail: 'ออกจากระบบสำเร็จ', life: 3000 })
}

const { isSuccess, data, error } = await getProfileService()
if (isSuccess && data) {
  mainStore.$patch({
    username: data.username,
    firstname: data.firstname,
    surname: data.surname,
    id: data.id,
  })
}

const unwatch = watch(() => route.path, () => {
  mainStore.isSidebarOpen = false
})

onUnmounted(() => {
  unwatch()
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[230px_1fr] h-full">
    <Sidebar
      v-model:visible="mainStore.isSidebarOpen"
      class="relative"
    >
      <h1 class="flex-none text-center">
        ธนาคารหมู่บ้าน
      </h1>
      <SidebarMenu />
      <div class="bottom-1.5 w-full p-2 absolute left-0">
        <Button
          class="w-full"
          outlined
          @click="logout"
        >
          ออกจากระบบ
        </Button>
      </div>
    </Sidebar>
    <aside class="shadow-lg h-[100vh] relative hidden lg:flex flex-col gap-1">
      <h1 class="flex-none text-center">
        ธนาคารหมู่บ้าน
      </h1>
      <SidebarMenu />
      <div class="bottom-1.5 left-0 w-full p-2 flex-none mt-auto">
        <Button
          class="w-full"
          outlined
          @click="logout"
        >
          ออกจากระบบ
        </Button>
      </div>
    </aside>
    <main
      id="main"
      class="overflow-hidden"
    >
      <Navbar
        :username="mainStore.username"
        :fullname="mainStore.fullname"
        @toggle-sidebar="mainStore.isSidebarOpen = !mainStore.isSidebarOpen"
      />
      <slot />
    </main>
  </div>
</template>
