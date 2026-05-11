<!-- docs/components/PhotoCard.vue -->
<template>
  <div class="photo-card">
    <!-- ... 图片容器、信息栏、标签区域等原有代码保持不变 ... -->
    <div class="image-container">
      <!-- 图片 -->
      <img :src="photo.src" :alt="photo.title" />

      <!-- 右上角数字角标 -->
      <div v-if="photo.id" class="badge">
        {{ photo.score }}
      </div>
    </div>

    <div class="info-bar">
      <span class="title">{{ photo.title }}</span>
      <button class="detail-btn" :class="isMobile ? 'is-mobile' : 'is-pc'" @click="handleDetailClick(photo)">
        详情
      </button>
    </div>

    <div class="tags-container">
      <span v-for="tag in displayTags" :key="tag" class="tag" :class="`is-${tag.type}`" @click="handleClickTag(tag)">#{{
        tag.name }}
      </span>
    </div>

    <!-- ================= 修改区域：根据平台条件渲染弹窗 ================= -->

    <!-- PC端弹窗：当屏幕宽度 >= 768px 时显示 -->
    <DetailModal v-if="!isMobile" v-model="isModalVisible" :data="currPhoto" :tags="displayTags" @save="() => { }" />

    <!-- 移动端弹窗：当屏幕宽度 < 768px 时显示 -->
    <DetailModalMobile v-else v-model="isModalVisible" :data="currPhoto" :tags="displayTags" @save="() => { }" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// 1. 引入 useMediaQuery 用于检测设备类型
import { useMediaQuery } from '@vueuse/core'

import DetailModal from './DetailModal.vue'
import DetailModalMobile from './DetailModalMobile.vue'


// 定义组件接收的 Props
const props = defineProps({
  photo: {
    type: Object,
    required: true,
  },
  scenes: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

// 存储标签字典数据
const scenesMap = ref({})
const categoriesMap = ref({})
// 计算属性：处理标签展示 (场景在前，分类在后，匹配不到不显示)
const displayTags = computed(() => {
  const resultTags = []
  const tagIds = props.photo.tags || []
  // console.log('tagIds:', tagIds)
  // 转换为 Map 方便查找 (id -> name)
  // console.log('props.scenes:', props.scenes)
  scenesMap.value = props.scenes.reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})

  categoriesMap.value = props.categories.reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})

  // console.log('scenesMap.value:', scenesMap.value)
  // 1. 第一遍遍历：只找场景标签 (保证场景在前)
  tagIds.forEach(id => {
    // 只有当字典中存在该 ID 时才添加
    if (scenesMap.value[id]) {
      resultTags.push({
        id: id,
        name: scenesMap.value[id],
        type: 'primary',
        url: `scenes`
      })
    }
  })

  // 2. 第二遍遍历：只找分类标签 (保证分类在后)
  tagIds.forEach(id => {
    // 只有当字典中存在该 ID 时才添加
    if (categoriesMap.value[id]) {
      resultTags.push({
        id: id,
        name: categoriesMap.value[id],
        type: 'success',
        url: `categories`
      })
    }
  })
  // console.log('resultTags:', resultTags, categoriesMap.valuae)
  return resultTags
})

// 2. 定义响应式变量：判断是否为移动端 (最大宽度 768px)
// 你可以根据设计稿调整这个像素值
const isMobile = useMediaQuery('(max-width: 768px)')

// 弹窗控制状态
// 注意：这里我们将两个弹窗的可见性合并为一个状态，因为它们不会同时出现
const isModalVisible = ref(false)
const currPhoto = ref({})

// 处理详情按钮点击
const handleDetailClick = (row) => {
  currPhoto.value = row
  isModalVisible.value = true // 打开弹窗
}

// 2. 获取路由实例
const handleClickTag = (tag) => {
  console.log('tag:', tag)

  if (tag.url === 'scenes') {
    // 场景跳转逻辑：跳转到 /scenes/list/scene.{id}
    window.location.href = `./scenes/list/scene.${tag.id}`
  } else if (tag.url === 'categories') {
    // 分类跳转逻辑：跳转到 /categories/list/category.{id}
    window.location.href = `./categories/list/category.${tag.id}`
  }
}

// 关闭弹窗的逻辑由 v-model 自动处理，或者你可以在子组件中 emit('update:modelValue', false)
</script>

<style scoped>
/* ... 原有样式保持不变 ... */
.photo-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  font-family: sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.image-container {
  position: relative;
  width: 100%;
  height: 400px;
  /* 修正：如果想要正方形，padding-top: 100% 会导致高度依赖宽度，这里直接写死或调整 */
  /* 如果想要 1:1 正方形，建议： */
  /* aspect-ratio: 1 / 1; */
  background-color: #f5f5f5;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff3b30;
  color: white;
  font-size: 12px;
  font-weight: bold;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 14px;
  color: #333;
}

.detail-btn {
  background-color: transparent;
  border: 1px solid #999;
  color: #333;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}

.detail-btn:hover {
  background-color: #f0f0f0;
}

.tags-container {
  padding: 10px;
  /* background-color: #fafafa; */
}

.tag {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
  cursor: pointer;
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
</style>