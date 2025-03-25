<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, watch } from 'vue'

const Sider = defineAsyncComponent(() => import('./components/Sider.vue'))
const MindMap = defineAsyncComponent(() => import('./components/MindMap.vue'))

// In a real app, these would be imported from actual APIs
// import { genMindMap } from '@/api/chat';
// import { isBlank } from '@/utils/is';

const loading = ref(false)
const genText = ref('')

// 监视 genText 的变化
async function onGenerate(text: string) {
  if (!text || text.trim() === '') {
    return
  }

  loading.value = true
  try {
    // In a real implementation, this would call an API
    // For now, we'll just use a simple markdown transformation
    const header = '# ' + text + '\n\n'
    const sections = ['## 主要概念', '### 定义', '### 特点', '## 相关应用', '### 实际案例', '#### 示例1', '#### 示例2', '### 潜在用途', '## 未来发展', '### 技术趋势', '### 可能的挑战']

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    genText.value = header + sections.join('\n')
    console.log('Generated and set new genText:', genText.value)
  } finally {
    loading.value = false
  }
}

function onRender(text: string) {
  // 防止 genText 被设置为空字符串
  if (!text || text.trim() === '') {
    return
  }

  genText.value = text
}
</script>

<template>
  <div class="w-full flex h-full">
    <Sider :genText="genText" :loading="loading" @generate="onGenerate" @render="onRender" />
    <MindMap :genText="genText" :loading="loading" />
  </div>
</template>

<style scoped></style> 