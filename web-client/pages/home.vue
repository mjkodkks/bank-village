<script setup lang="ts">
import { getStatService } from '~/services/stat';

definePageMeta({
    layout: 'dashboard',
    middleware: ["auth"]
})
const router = useRouter()

const stats = ref([
    {
        title: 'จำนวนสมาชิกทั้งหมด',
        score: 0,
        color: '#F8F0E5'
    },
    {
        title: 'จำนวนการขอฝาก',
        score: 0,
        color: '#AED2FF'
    },
    {
        title: 'จำนวนการขอถอน',
        score: 0,
        color: '#DAC0A3'
    },
    {
        title: 'บัญชีทั้งหมด',
        score: 0,
        color: '#FFC7EA'
    },
])

async function getStat() {
    const { isSuccess, data, error } = await getStatService()
    if (isSuccess && data) {
        // console.log(data)
        stats.value[0].score = data.usersCount
        stats.value[1].score = data.transactionDeposit
        stats.value[2].score = data.transactionWithdraw
        stats.value[3].score = data.accountsCount
    }
}

function init() {
    getStat()
}

init()

</script>

<template>
    <div class="h-full px-2 md:px-6 xl:px-8 py-8">
        <h1 class="text-center mb-0">ยินดีต้อนรับ</h1>
        <h3 class="font-light text-center m-0">ธนาคารหมู่บ้านตามแนวพระราชดำริ (สาขา บ้านกุดโดน)</h3>
        <h1>สถิติ (stat)</h1>
        <hr class="border-gray-200 border border-solid" />
        <div class="grid grid-cols-1 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8 justify-center mt-8">
            <HomeCardStat v-for="stat in stats" :color="stat.color" :title="stat.title" :score="stat.score" ></HomeCardStat>
        </div>
        <hr class="border-gray-200 border border-solid mt-8" />
        <div class="flex justify-center mt-8">
            <Button size="large" icon="pi pi-chevron-right" label="เริ่มใช้งานระบบ" @click="router.push('member')"></Button>
        </div>
    </div>
</template>
