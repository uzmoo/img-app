<template>
    <div class="photo-page">
        <h1>📷 全部照片 <span class="page-num">P.{{ current }}</span></h1>

        <!-- 加载状态 -->
        <div v-if="!isLoaded" class="loading">加载中...</div>

        <!-- 照片网格 -->
        <div class="photo-grid" v-else>
            <PhotoCard v-for="photo in currentData" :key="photo.id" :photo="photo" :scenes="scenesData"
                :categories="categoriesData" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PhotoCard from '../components/PhotoCard.vue'
import { fetchData } from '../api/index.js'
import { transfer } from '../hooks/useData.js'
import { getScenesList, getCategoriesList } from '../hooks/useCategories.js'

// --- Props ---
// 接收当前页码，例如 1, 2, 3
const props = defineProps({
    current: {
        type: Number,
        default: 1
    }
})

// --- 状态定义 ---
const rawData = ref([])
const isLoaded = ref(false)
const scenesData = ref([])
const categoriesData = ref([])

// --- 常量 ---
const ITEMS_PER_PAGE = 10

// --- 计算属性 ---

// 直接根据传入的 current 属性计算数据，不再依赖 URL
const currentData = computed(() => {
    const start = (props.current - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return rawData.value.slice(start, end)
})

// --- 方法 ---
const loadData = async () => {
    const data = await fetchData('data.json')
    scenesData.value = await getScenesList()
    categoriesData.value = await getCategoriesList()
    rawData.value = transfer('photo', data)
    isLoaded.value = true
}

// --- 生命周期 ---
onMounted(() => {
    loadData()
})
</script>

<style scoped>
.photo-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--vp-c-text-1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.page-num {
    font-size: 0.5em;
    background: var(--vp-c-brand);
    color: white;
    padding: 0.2em 0.6em;
    border-radius: 4px;
}

.photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    justify-items: center;
}

.loading {
    text-align: center;
    color: var(--vp-c-text-2);
    padding: 2rem;
}
</style>