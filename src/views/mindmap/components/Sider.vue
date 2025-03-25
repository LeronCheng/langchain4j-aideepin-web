<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { NButton, NInput } from 'naive-ui'

const props = defineProps<{
  loading: boolean
  genText: string
}>()

const loading = computed(() => {
  return props.loading
})

const emit = defineEmits(['generate', 'render'])
const text = ref('')
const gen = ref('')

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
# 番茄炒蛋的制作流程

## 材料准备
- 购买新鲜的番茄和鸡蛋
- 准备调味料，如盐，糖，酱油等

## 制作步骤
### 步骤1：准备食材
- 清洗番茄，切成块状
- 破开鸡蛋，搅拌均匀

### 步骤2：炒制
- 热锅凉油，倒入鸡蛋液翻炒至熟
- 将炒好的鸡蛋盛出备用
- 锅里重新加油，放入番茄翻炒至汁液出来

### 步骤3：调味
- 倒入炒好的鸡蛋，加入适量的盐，糖，酱油等调料翻炒均匀

### 步骤4：出锅
- 炒至食材完全融合，出锅即可

## 注意事项
- 注意控制火候，避免炒焦
- 根据个人口味调整调料比例
  `
  emit('render', gen.value)
}

function onGenerate() {
  emit('generate', text.value)
}

// 在组件挂载时确保 gen.value 正确初始化
onMounted(() => {
  // 如果 gen 为空但 props.genText 有值，同步数据
  if ((!gen.value || gen.value.trim() === '') && props.genText) {
    console.log('Initializing gen.value with props.genText on mount')
    gen.value = props.genText
  }
})
</script>

<template>
  <div class="w-[65%] border-r p-4 pt-2">
    <div class="py-2 flex items-center justify-between gap-1">
      <div class="text-nowrap">内容描述</div>

      <!-- Model selector would be here in a real app -->
    </div>

    <NInput v-model="text" :disabled="loading" placeholder="请输入要生成思维导图的主题或问题" :rows="6" type="textarea" />
    <div class="mt-2 mb-2">
      <NButton :loading="loading" block secondary type="success" @click="onGenerate">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
          </svg>
        </template>
        生成思维导图
      </NButton>
    </div>

    <div class="mt-6">
      <div class="flex flex-wrap justify-between items-center mb-2">
        <div class="flex items-center gap-1">
          <span>输出内容</span>
          <NButton text type="success" @click="onCase">示例</NButton>
        </div>
        <NButton secondary size="tiny" type="success" @click="onReRender">重新渲染</NButton>
      </div>
    </div>
    <NInput v-model:value="gen" placeholder="生成的Markdown格式思维导图内容将显示在这里" @blur="blurr" :rows="16" type="textarea" />
  </div>
</template>

<style scoped></style> 