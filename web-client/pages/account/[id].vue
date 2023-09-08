<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})
const router = useRouter()
</script>

<template>
    <div class="h-[200vh]">Account id</div>
</template>
