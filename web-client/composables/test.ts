export function useTest() {
    const x = ref()

    onMounted(() => {
        x.value = "foo"
    })

    return {
        x
    }
}