export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const main = document.getElementById('main')
    if (main) {
      main.scrollTo(0, 0)
    }
  })
})
