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
// import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

// const breakpoints = useBreakpoints(breakpointsTailwind)
// const isMobile = breakpoints.smallerOrEqual('sm')

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
    <ConfirmDialog style="white-space: pre;"></ConfirmDialog>
  </div>
</template>

<style>
:root {
  --font-family: 'Kanit', sans-serif;
  --font-base: 16px;
  --primary-color: #007bff;

  @media screen and (max-width: 1024px) {
    --font-base: 12px;
  }
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

.p-button {}

.p-datatable.p-datatable-hoverable-rows .p-datatable-tbody>tr:not(.p-highlight):hover {
  transform: translateY(-1px);
  background: #e9ecef;
  box-shadow: 5px 5px 5px 0px #f3f3f3;
  transition: all 0.5s;
}

.p-datatable-stripe.p-datatable.p-datatable-hoverable-rows .p-datatable-tbody>tr:not(.p-highlight):hover {
  transform: translateY(0);
  background: #e9ecef;
  box-shadow: none;
}

.tracking-in-expand {
  -webkit-animation: tracking-in-expand 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
  animation: tracking-in-expand 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}

/**
 * ----------------------------------------
 * animation tracking-in-expand
 * ----------------------------------------
 */
@-webkit-keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }

  40% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}

@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }

  40% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>
