<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { NButton, NInput, NTabs, NTabPane, NRadioGroup, NRadio, NRadioButton } from 'naive-ui'
import Avatar from '@/views/chat/components/Message/Avatar.vue'

const props = defineProps<{
  loading: boolean
  genText: string
}>()

const loading = computed(() => {
  return props.loading
})

const emit = defineEmits<{
  (e: 'generate', text: string, model: string, color: string): void
  (e: 'render', text: string): void
  (e: 'update:genText', text: string): void
}>()

const text = ref('')
const gen = ref('')
const selectedModel = ref('claude')
const selectedColor = ref('蓝色')

const colorOptions = [
  { label: '红色', value: '红色', bg: '#ffebee', dot: '#f44336' },
  { label: '橙色', value: '橙色', bg: '#fff3e0', dot: '#ff9800' },
  { label: '黄色', value: '黄色', bg: '#fffde7', dot: '#ffeb3b' },
  { label: '绿色', value: '绿色', bg: '#e8f5e9', dot: '#4caf50' },
  { label: '青色', value: '青色', bg: '#e0f7fa', dot: '#00bcd4' },
  { label: '蓝色', value: '蓝色', bg: '#e3f2fd', dot: '#2196f3' },
  { label: '紫色', value: '紫色', bg: '#f3e5f5', dot: '#9c27b0' }
]

watch(
  () => props.genText,
  val => {
    gen.value = val
  },
  { immediate: true }
)

function onReRender() {
  emit('render', gen.value)
}

function onCase() {
  text.value = `番茄炒蛋怎么做`
  gen.value = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <!-- 背景 -->
  <rect width="1280" height="720" fill="#ffffff"/>
  
  <!-- 顶部标题栏 -->
  <rect x="0" y="0" width="1280" height="80" fill="#003366"/>
  <text x="60" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">下周重点任务</text>
  
  <!-- 内容区域 -->
  <g>
    <!-- 时间轴 -->
    <line x1="150" y1="200" x2="1130" y2="200" stroke="#dddddd" stroke-width="4"/>
    
    <!-- 时间节点1 -->
    <circle cx="250" cy="200" r="20" fill="#0066cc"/>
    <text x="250" y="170" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">3月4日前</text>
    <rect x="150" y="230" width="200" height="100" rx="5" ry="5" fill="#e6f2ff" stroke="#0066cc" stroke-width="2"/>
    <text x="250" y="270" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#333333">V8盖板</text>
    <text x="250" y="300" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">专项改善会议</text>
    
    <!-- 时间节点2 -->
    <circle cx="600" cy="200" r="20" fill="#0066cc"/>
    <text x="600" y="170" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">本周内</text>
    <rect x="500" y="230" width="200" height="100" rx="5" ry="5" fill="#e6f2ff" stroke="#0066cc" stroke-width="2"/>
    <text x="600" y="270" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#333333">负极盖板</text>
    <text x="600" y="300" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">紧急采购方案</text>
    
    <!-- 时间节点3 -->
    <circle cx="950" cy="200" r="20" fill="#0066cc"/>
    <text x="950" y="170" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">本周内</text>
    <rect x="850" y="230" width="200" height="100" rx="5" ry="5" fill="#e6f2ff" stroke="#0066cc" stroke-width="2"/>
    <text x="950" y="270" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#333333">设备扫码系统</text>
    <text x="950" y="300" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">升级验证</text>
  </g>
  
  <!-- 底部KPI指标区域 -->
  <g>
    <rect x="150" y="400" width="300" height="180" rx="5" ry="5" fill="#f5f5f5" stroke="#dddddd" stroke-width="2"/>
    <text x="300" y="440" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#003366">V8盖板改善</text>
    <rect x="180" y="460" width="240" height="30" rx="3" ry="3" fill="#e6f2ff"/>
    <text x="190" y="480" font-family="Arial, sans-serif" font-size="16" fill="#333333">• 召开专项会议</text>
    <rect x="180" y="500" width="240" height="30" rx="3" ry="3" fill="#e6f2ff"/>
    <text x="190" y="520" font-family="Arial, sans-serif" font-size="16" fill="#333333">• 确定改善方案</text>
    <circle cx="170" cy="430" r="15" fill="#ff9900"/>
    <text x="170" y="435" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#ffffff">!</text>
    
    <rect x="490" y="400" width="300" height="180" rx="5" ry="5" fill="#f5f5f5" stroke="#dddddd" stroke-width="2"/>
    <text x="640" y="440" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#003366">负极盖板采购</text>
    <rect x="520" y="460" width="240" height="30" rx="3" ry="3" fill="#e6f2ff"/>
    <text x="530" y="480" font-family="Arial, sans-serif" font-size="16" fill="#333333">• 确定供应商</text>
    <rect x="520" y="500" width="240" height="30" rx="3" ry="3" fill="#e6f2ff"/>
    <text x="530" y="520" font-family="Arial, sans-serif" font-size="16" fill="#333333">• 落实采购方案</text>
    <circle cx="510" cy="430" r="15" fill="#cc0000"/>
    <text x="510" y="435" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#ffffff">!</text>
    
    <rect x="830" y="400" width="300" height="180" rx="5" ry="5" fill="#f5f5f5" stroke="#dddddd" stroke-width="2"/>
    <text x="980" y="440" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#003366">设备扫码系统</text>
    <rect x="860" y="460" width="240" height="30" rx="3" ry="3" fill="#e6f2ff"/>
    <text x="870" y="480" font-family="Arial, sans-serif" font-size="16" fill="#333333">• 系统升级部署</text>
    <rect x="860" y="500" width="240" height="30" rx="3" ry="3" fill="#e6f2ff"/>
    <text x="870" y="520" font-family="Arial, sans-serif" font-size="16" fill="#333333">• 验证系统功能</text>
    <circle cx="850" cy="430" r="15" fill="#009933"/>
    <text x="850" y="435" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#ffffff">✓</text>
  </g>
  
  <!-- 底部栏 -->
  <rect x="0" y="680" width="1280" height="40" fill="#f5f5f5"/>
  <text x="1220" y="705" font-family="Arial, sans-serif" font-size="14" text-anchor="end" fill="#666666">制作日期: 2025年4月1日</text>
</svg>
`
  emit('render', gen.value)
}

function onGenerate() {
  if (!text.value || text.value.trim() === '') {
    return
  }
  // 先清空生成的内容
  emit('update:genText', '')
  // 然后生成新内容
  emit('generate', text.value, selectedModel.value, selectedColor.value)
}

function onRender() {
  if (!gen.value || gen.value.trim() === '') {
    return
  }
  emit('render', gen.value)
}

// 在组件挂载时确保 gen.value 正确初始化
onMounted(() => {
  // 如果 gen 为空但 props.genText 有值，同步数据
  if ((!gen.value || gen.value.trim() === '') && props.genText) {
    gen.value = props.genText
  }
})
</script>

<template>
  <div class="w-[65%] border-r p-4 pt-2">
    <div class="flex space-x-2 items-center">
      <div>
        <div class="mb-4">
          <span class="mr-2">选择模型：</span>
          <NRadioGroup v-model:value="selectedModel" name="model-type" class="flex gap-4">
            <NRadioButton value="claude">
              <div class="flex items-center">
                <Avatar name="claude" :image-size="20" class="mr-2" />
                <span>Claude</span>
              </div>
            </NRadioButton>
            <NRadioButton value="deepseek">
              <div class="flex items-center">
                <Avatar name="deepseek" :image-size="20" class="mr-2" />
                <span>Deepseek</span>
              </div>
            </NRadioButton>
          </NRadioGroup>
        </div>
        <div class="mb-4">
          <span class="mr-2">选择颜色：</span>
          <NRadioGroup v-model:value="selectedColor" name="color-type" class="flex gap-2 flex-wrap">
            <NRadioButton v-for="color in colorOptions" :key="color.value" :value="color.value" class="!min-w-0 !w-auto px-3">
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: color.dot }"></div>
                <span>{{ color.label }}</span>
              </div>
            </NRadioButton>
          </NRadioGroup>
        </div>
      </div>
    </div>

    <div class="py-2 flex items-center justify-between gap-1">
      <div class="text-nowrap">内容描述</div>
    </div>
    <NInput v-model:value="text" type="textarea" :autosize="{ minRows: 8, maxRows: 20 }" placeholder="请输入内容" class="mb-4" />
    <div class="mt-2 mb-2">
      <NButton :loading="loading" block secondary type="primary" @click="onGenerate">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
          </svg>
        </template>生成PPT
      </NButton>
    </div>

    <!-- <div class="mt-6">
      <div class="flex flex-wrap justify-between items-center mb-2">
        <div class="flex items-center gap-1">
          <span>输出内容</span>
          <NButton text type="primary" @click="onCase">示例</NButton>
        </div>
        <NButton secondary size="tiny" type="primary" @click="onReRender">重新渲染</NButton>
      </div>
    </div>
    <NInput v-model:value="gen" placeholder="生成的HTML格式的PPT内容" :rows="16" type="textarea" /> -->
  </div>
</template>

<style scoped></style> 