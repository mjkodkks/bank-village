<script
  setup
  lang="ts"
>
const routes = ref([
  {
    label: 'หน้าหลัก',
    route: '/home',
  },
  {
    label: 'สมาชิก',
    route: '/member',
  },
  {
    label: 'บัญชีทั้งหมด',
    route: '/account',
  },
])

const routePage = useRoute()
</script>

<template>
  <ul class="list-none p-0 overflow-y-auto overflow-x-hidden m-0 flex flex-col gap-2">
    <li
      v-for="route in routes"
      :key="route.route"
      class="px-4"
    >
      <NuxtLink
        :to="route.route"
        class="w-full h-10 no-underline transition-all duration-200 flex items-center p-2 rounded-lg font-extralight"
        :class="routePage.path === route.route ? 'bg-primary text-white hover:opacity-80 font-normal' : 'text-black hover:bg-gray-100'"
      >
        <div class="">
          {{ route.label }}
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>
