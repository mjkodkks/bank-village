<script setup lang="ts">
import { getReportListUserReceiveInterest } from '~/services/report'
import { getStatService } from '~/services/stat'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})
const currentYear = new Date().getFullYear()
const startYear = 2024
// create year list from 2024 to current year
// e.g. [2024, 2025, 2026, ..., currentYear
const yearList = Array.from({ length: currentYear - 2023 }, (_, i) => startYear + i)
const selectedYear = ref(2024)
const isDialogVisible = ref(false)
const headerDialog = ref('ดาวน์โหลดรายงาน')

const accountTypeList = [
  { label: 'บัญชีออมทรัพย์', value: 'SAVING' },
  { label: 'บัญชีหุ้น', value: 'STOCK' },
]
const selectedAccountType = ref<AccountType>('SAVING')

async function downloadReport() {
  const template = {
    year: selectedYear.value,
    accountType: selectedAccountType.value,
  }
  try {
    const { isSuccess, response } = await getReportListUserReceiveInterest(
      template,
    )
    if (isSuccess && response) {
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'downloaded-file'

      if (contentDisposition && contentDisposition.includes('attachment')) {
        const decodedContentDisposition = decodeURIComponent(contentDisposition)
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(decodedContentDisposition)
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }
      console.log(filename)
      const data = response._data
      const link = document.createElement('a')
      link.href = URL.createObjectURL(data)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  catch (error) {}
}

function resetForm() {
  selectedYear.value = 2024
}

function openDialogDownloadConfig() {
  isDialogVisible.value = true
}

function init() {}

init()
</script>

<template>
  <div class="h-[calc(100dvh_-_50px)] overflow-auto px-2 md:px-6 xl:px-8 py-8">
    <h1 class="text-center mb-0">
      รายงาน
    </h1>
    <div class="mt-8 flex gap-4 items-center">
      <div>1) เอกสารดอกเบี้ยออมทรัพย์ธนาคารหมู่บ้าน_สาขากุดโดน</div>
      <Button
        severity="success"
        icon="pi pi-angle-double-up"
        label="ดาวน์โหลดรายงาน"
        class="py-1 px-2"
        @click="() => openDialogDownloadConfig()"
      />
    </div>

    <Dialog
      v-model:visible="isDialogVisible"
      modal
      :header="headerDialog"
      :breakpoints="{
        '1440px': '40vw',
        '1024px': '60vw',
        '820px': '80vw',
        '400px': '90vw',
      }"
      @hide="resetForm()"
    >
      <div class="grid gap-4">
        <div class="grid gap-2">
          <div
            v-for="accType in accountTypeList"
            :key="accType.label"
            class="flex align-items-center gap-2"
          >
            <RadioButton
              v-model="selectedAccountType"
              :input-id="accType.label"
              name="dynamic"
              :value="accType.value"
            />
            <label :for="accType.value" class="ml-2">{{ accType.label }}</label>
          </div>
        </div>
        <div class="flex gap-2">
          <label for="select_year" class="text-lg">เลือกปีดอกเบี้ย</label>
          <select
            v-model="selectedYear"
            name="select_year"
            class="inline-block p-inputtext p-component p-0 h-fit"
            style="appearance: auto"
          >
            <option v-for="year in yearList" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div>
          <Button
            severity="success"
            icon="pi pi-download"
            label="ดาวน์โหลดรายงาน"
            @click="() => downloadReport()"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
