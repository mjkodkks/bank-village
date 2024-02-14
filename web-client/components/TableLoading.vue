<script setup lang="ts">
interface Props {
  rows: number
  cols: number
}

const props = defineProps<Props>()

const mockData = ref()

onMounted(() => {
  const product = []
  for (let i = 0; i < props.rows; i++) {
    const template = {} as { [x: string | number]: string | number }
    for (let j = 0; j < props.cols; j++) {
      template[j] = j
    }
    product.push(template)
  }
  mockData.value = product
})
</script>

<template>
  <DataTable :value="mockData">
    <Column v-for="col in cols" :key="col" :field="`${col - 1}`">
      <template #header>
        <Skeleton />
      </template>
      <template #body>
        <Skeleton />
      </template>
    </Column>
  </DataTable>
</template>
