<template>
    <el-dialog v-model="visible" title="图片信息(M)" width="90%" @close="handleClose" :close-on-click-modal="true"
        :top="isZoomed ? '5vh' : '8vh'"
        :class="isZoomed ? 'custom-annotation-dialog zoom-mode' : 'custom-annotation-dialog'">
        <div class="modal-content" :class="{ 'zoom-mode': isZoomed }">
            <!-- ================= 左侧区域 ================= -->
            <div class="left-panel">
                <!-- 上半部分：图片 -->
                <div class="image-container" :class="{ 'zoom-mode': isZoomed }">
                    <img :src="currentData?.src" alt="Preview" @click="toggleZoom" />
                    <!-- 右上角总分徽章 -->
                    <div class="score-badge">
                        <div class="score-num">{{ currentData?.totalScore || 0 }}</div>
                        <div class="score-text">{{ getLevelText(currentData?.totalScore) }}</div>
                    </div>
                </div>

                <!-- 下半部分：当前标注 (纯展示) -->
                <div class="tags-container" :class="{ 'zoom-mode': isZoomed }">
                    <div class="section-label">标签:</div>
                    <div class="tags-list">
                        <!-- <el-tag v-for="(tag, index) in tags" :key="index" size="small" :type="tag.type">
                            #{{ tag.name }}
                        </el-tag> -->
                        <span v-for="tag in tags" :key="tag" class="tag" :class="`is-${tag.type}`">#{{
                            tag.name }}
                        </span>
                        <!-- 如果没有标签的占位 -->
                        <span v-if="!tags?.length" class="empty-text">暂无标签</span>
                    </div>
                </div>
            </div>

            <!-- ================= 右侧区域 ================= -->
            <div class="right-panel" :class="{ 'zoom-mode': isZoomed }">
                <!-- 顶部：照片描述 (纯展示) -->
                <div class="description-section">
                    <h3 class="section-title">描述</h3>
                    <div class="description-content">
                        {{ currentData?.desc || '暂无描述...' }}
                    </div>
                </div>

                <!-- 底部：评分详情列表 -->
                <div class="rating-list" v-if="0">
                    <div v-for="(item, index) in ratingItems" :key="index" class="rating-item">
                        <!-- 标签名 -->
                        <span class="label">{{ item.label }}</span>

                        <!-- 星星组 -->
                        <div class="stars">
                            <el-icon v-for="n in 5" :key="n" :color="n <= item.value ? '#F7BA2A' : '#DCDFE6'">
                                <StarFilled v-if="n <= item.value" />
                                <Star v-else />
                            </el-icon>
                        </div>

                        <!-- 评价文字 -->
                        <span class="level-text">{{ item.level }}</span>
                    </div>
                </div>
                <!-- 评分区域：改为双列网格布局 -->
                <div class="rating-grid">
                    <!-- 第一列 -->
                    <div class="rating-column">
                        <div v-for="(item, index) in ratingItems.slice(0, 3)" :key="index" class="rating-item">
                            <div class="item-header">
                                <span class="label">{{ item.label }}</span>
                                <span class="level-text">{{ item.level }}</span>
                            </div>
                            <div class="stars">
                                <el-icon v-for="n in 5" :key="n" :color="n <= item.value ? '#F7BA2A' : '#DCDFE6'">
                                    <StarFilled v-if="n <= item.value" />
                                    <Star v-else />
                                </el-icon>
                            </div>
                        </div>
                    </div>

                    <!-- 第二列 -->
                    <div class="rating-column">
                        <div v-for="(item, index) in ratingItems.slice(3, 6)" :key="index" class="rating-item">
                            <div class="item-header">
                                <span class="label">{{ item.label }}</span>
                                <span class="level-text">{{ item.level }}</span>
                            </div>
                            <div class="stars">
                                <el-icon v-for="n in 5" :key="n" :color="n <= item.value ? '#F7BA2A' : '#DCDFE6'">
                                    <StarFilled v-if="n <= item.value" />
                                    <Star v-else />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!--  -->
                <!--  -->
                <!--  -->
            </div>
        </div>

        <!-- 底部按钮 -->
        <!-- <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
            </span>
        </template> -->
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'

// --- Props & Emits ---
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) },
    tags: { type: Array, default: () => [] }

})
const emit = defineEmits(['update:modelValue'])

// --- State ---
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const currentData = ref({})

// --- 模拟评分数据逻辑 ---
// 这里定义右侧的 6 个维度，实际项目中应从 currentData 中获取
const ratingItems = computed(() => [
    { label: '曝光', value: currentData.value?.scores?.exposure, level: getLevelText(currentData.value?.scores?.exposure) },
    { label: '清晰度', value: currentData.value?.scores?.clarity, level: getLevelText(currentData.value?.scores?.clarity) },
    { label: '色彩', value: currentData.value?.scores?.color, level: getLevelText(currentData.value?.scores?.color) },
    { label: '构图', value: currentData.value?.scores?.composition, level: getLevelText(currentData.value?.scores?.composition) },
    { label: '创意', value: currentData.value?.scores?.creativity, level: getLevelText(currentData.value?.scores?.creativity) },
    { label: '情感表达', value: currentData.value?.scores?.emotion, level: getLevelText(currentData.value?.scores?.emotion) },
])

// --- Methods ---
const getLevelText = (score) => {
    // console.log('score:', score, typeof score)
    if (!score) return '未评分'
    if (score >= 5) return '完美'
    if (score >= 4) return '优秀'
    if (score >= 3) return '良好'
    if (score >= 2) return '一般'
    return '待进步'
}
watch(
    () => props.modelValue,
    (val) => {
        if (val) {
            // 简单的深拷贝防止引用污染
            currentData.value = JSON.parse(JSON.stringify(props.data))
            console.log('currentData.value', currentData.value)
            currentData.value.totalScore = Object.values(currentData.value.scores).reduce((e, i) => e + i, 0)
        } else {
            isZoomed.value = false
        }
    }
)

const handleClose = () => {
    emit('update:modelValue', false)
}

const isZoomed = ref(false) // 控制放大状态

const toggleZoom = () => {
    isZoomed.value = !isZoomed.value
}
</script>
<style>
.custom-annotation-dialog {
    transition: all ease-in-out .5s;
}
</style>
<style scoped>
/* 整体布局 */
.modal-content {
    display: flex;
    flex-direction: column;
    overflow: auto;
    gap: 30px;
    height: 460px;
    padding-bottom: 10px;
    position: relative;
    transition: all ease-in-out .5s;
}

.modal-content.zoom-mode {
    height: 565px;
}


/* ================= 左侧样式 ================= */
.left-panel {

    /* width: 450px; */
    /* 固定宽度，保证图片大小一致 */
    display: flex;
    flex-direction: column;
    /* overflow: hidden; */
    /* 如果需要严格各占一半高度，可以使用 flex: 1 给子元素，这里为了适应图片比例采用自适应 */
}

.image-container {
    height: 250px;
    transition: all ease-in-out .5s;
    margin-top: 5px;
}

.image-container.zoom-mode {
    height: 450px;
}

.image-container img {
    width: fit-content;
    height: 100%;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.5);
}

/* 右上角蓝色徽章 */
.score-badge {
    position: absolute;
    bottom: 180px;
    left: 250px;
    width: 60px;
    height: 60px;
    background: #409EFF;
    color: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 2;
    transition: all ease-in-out .5s;
}

.image-container.zoom-mode .score-badge {
    bottom: 80px;
}

.score-num {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
}

.score-text {
    font-size: 10px;
    margin-top: 2px;
}

/* 标注标签区域 */
.tags-container {
    flex: 1;
    /* 占据剩余空间 */
    background: #fff;
    position: relative;
    bottom: -5px;
    opacity: 1;
    transition: all ease-in-out .5s;

}

.tags-container.zoom-mode {
    bottom: -200px;
    opacity: 0;
}

.section-label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    /* gap: 8px; */
}


.tag {
    font-size: 12px;
    color: #666;
    margin-right: 8px;
    height: 24px;
    padding: 0 9px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    margin-bottom: 3px;
}

.tag.is-primary {
    background-color: rgb(236, 245, 255);
    border-color: rgb(217, 236, 255);
    color: #409eff;
}

.tag.is-success {
    background-color: rgb(240, 249, 235);
    border-color: rgb(225, 243, 216);
    color: #67c23a;

}

.static-tag {
    /* 覆盖 Element Plus 默认样式，使其更像示意图中的浅蓝色 */
    background-color: #ecf5ff;
    border-color: #d9ecff;
    color: #409eff;
    border-radius: 4px;
}

.empty-text {
    font-size: 12px;
    color: #999;
}

/* ================= 右侧样式 (新布局) ================= */
.right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 描述区域 */
.description-section {
    margin-bottom: 25px;
    /* 调整间距 */
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #303133;
}

.description-content {
    width: 100%;
    height: 190px;
    /* 调整高度以适应示意图 */
    padding: 15px;
    background-color: #f9f9fb;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    color: #606266;
    line-height: 1.6;
    font-size: 14px;
    white-space: pre-wrap;
}

/* 评分网格布局 */
.rating-grid {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.rating-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    /* 评分项之间的垂直间距 */
}

/* 单个评分项 */
.rating-item {
    display: flex;
    flex-direction: column;
    width: 115px;
}

.item-header {
    display: flex;
    justify-content: space-between;
    /* margin-bottom: 6px; */
    /* 文字与星星的间距 */
}

.label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
}

.level-text {
    font-size: 13px;
    color: #f7ba2a;
    font-weight: 500;
}

.stars {
    display: flex;
    gap: 5px;
    /* 星星之间的间距 */
}

.stars .el-icon {
    font-size: 20px;
    /* 星星大小 */
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>