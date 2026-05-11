<template>
    <div class="scene-page">
        <!-- 标题可以根据 currentId 动态查找，或者简单显示 -->
        <h1>🎬 场景：{{ currentSceneName || '加载中' }}</h1>

        <!-- 1. 加载状态 -->
        <div v-if="!isLoaded" class="status-message loading">
            数据加载中...
        </div>

        <!-- 2. 无数据状态 (数据加载完 且 数组为空) -->
        <div v-else-if="currentData.length === 0" class="status-message empty">
            <div class="empty-icon">📭</div>
            <p>暂无相关照片</p>
            <span class="empty-desc">该场景下还没有收录任何内容</span>
        </div>

        <!-- 3. 正常数据状态 -->
        <div v-else class="scene-grid">
            <PhotoCard v-for="photo in currentData" :key="photo.id" :photo="photo" :scenes="scenesData"
                :categories="categoriesData" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PhotoCard from '../components/PhotoCard.vue'
import { transfer } from '../hooks/useData.js'
import { fetchData } from '../api/index.js'
import { getScenesList, getCategoriesList } from '../hooks/useCategories.js'

// --- Props ---
const props = defineProps({
    currentId: {
        type: Number,
        required: true
    }
})

const currentData = ref([])
const scenesData = ref([])
const categoriesData = ref([])
const isLoaded = ref(false)

const currentSceneName = computed(() => {
    const scene = scenesData.value.find(s => s.id === props.currentId)
    return scene ? scene.name : ''
})

const loadData = async () => {
    scenesData.value = await getScenesList()
    categoriesData.value = await getCategoriesList()

    const rawData = await fetchData('data.json')
    const allPhotos = transfer('photo', rawData)

    // 筛选数据
    currentData.value = allPhotos.filter(photo => photo.tags.includes(props.currentId))

    isLoaded.value = true
}

onMounted(async () => {
    await loadData()
})
</script>

<style scoped>
.scene-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--vp-c-text-1);
}

.scene-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    justify-items: center;
}

/* 通用状态样式 (加载/无数据) */
.status-message {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--vp-c-text-2);
    border: 1px dashed var(--vp-c-divider);
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
}

/* 无数据特定样式 */
.status-message.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.empty-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
}

.empty-desc {
    font-size: 0.875rem;
    color: var(--vp-c-text-3);
}

.loading {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}
</style>