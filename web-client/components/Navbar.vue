<script setup lang="ts">
type Props = {
    username?: string;
    fullname?: string;
}
const props = defineProps<Props>()
</script>

<template>
    <header class="h-[50px] bg-white border-solid border-x-0 border-t-0 border-b-gray-100 flex">
        <div class="flex items-center">
            <button
                class="lg:!hidden ml-4 cursor-pointer px-[10px] py-[2px] border-solid rounded-md border-2"
                @click="$emit('toggleSidebar')"
            >
                <i
                    aria-label="toggle sidebar"
                    class="pi pi-bars text-xl"
                ></i>
            </button>
        </div>
        <div class="flex items-center justify-center gap-2 px-8 ml-auto">
            <p
                class="text-sm"
                v-if="username"
            >({{ username }})</p>
            <p
                class="text-sm font-extralight"
                v-if="fullname"
            >{{ fullname }}</p>
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400">
                <i class="text-white pi pi-user"></i>
            </div>
        </div>
    </header>
</template>


<style scoped></style>