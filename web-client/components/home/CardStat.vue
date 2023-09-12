<script setup lang="ts">
type Props = {
    title: string;
    score: number;
    color: string;
}

const props = defineProps<Props>()

</script>

<template>
    <div :style="{ background: color }" class="rounded-lg border border-solid border-gray-200 shadow-md w-full">
        <h3 class="pl-8">{{ title }}</h3>
        <h1 class="text-center">{{ score }}</h1>
    </div>
</template>