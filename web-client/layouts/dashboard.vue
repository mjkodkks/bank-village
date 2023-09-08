<script setup lang="ts">
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore()
</script>


<template>
  <div class="grid grid-cols-[280px_1fr] h-full">
    <aside class="shadow-lg h-[100vh] relative flex flex-col gap-1">
      <Sidebar v-model:visible="mainStore.isSidebarOpen">
        <h1 class="text-center flex-none">ธนาคารหมู่บ้าน</h1>
         <SidebarMenu></SidebarMenu>
      </Sidebar>
      <h1 class="text-center flex-none">ธนาคารหมู่บ้าน</h1>
      <SidebarMenu></SidebarMenu>
      <div class=" bottom-1.5 w-full p-2 flex-none mt-auto">
            <Button class="w-full" outlined>ออกจากระบบ</Button>
      </div>
    </aside>
    <main class="overflow-auto" id="main">
      <slot />
    </main>
  </div>
</template>
