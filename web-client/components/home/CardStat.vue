<script setup lang="ts">
interface Props {
  title: string
  score: string
  color: string
}

const props = defineProps<Props>()
</script>

<template>
  <div :style="{ background: color }" class="rounded-lg text-white border border-solid border-gray-200 shadow-md w-full">
    <h3 class="pl-8">
      {{ title }}
    </h3>
    <h1 class="text-center tracking-in-expand">
      {{ score }}
    </h1>
  </div>
</template>
