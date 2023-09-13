<script setup>
useHead({
  title: 'ธนาคารหมู่บ้าน',
  link: [
    {
      rel: 'icon', type: 'image/x-icon', href: '/favicon.ico',
    },
    {
      rel: 'preconnect', href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'
    },
    {
      rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500&display=swap'
    }
  ],
})
import { usePrimeVue } from "primevue/config";

const $primevue = usePrimeVue();
defineExpose({
     $primevue
})
</script>

<template>
  <div class="nuxt-wrapper">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast></Toast>
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style>
:root {
  --font-family: 'Kanit', sans-serif;
  --font-base: 16px;
  --primary-color: #007bff;
}

html {
  font-size: var(--font-base);
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  overflow: hidden;
}

html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}

.nuxt-wrapper {
  height: 100%;
}
.p-component {
  font-family: var(--font-family);
}
.p-inputtext {
  font-weight: 200;
}
.p-button {
}

</style>
