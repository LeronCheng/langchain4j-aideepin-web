<script setup lang="ts">
import Sider from './components/Sider.vue'
import MindMap from './components/MindMap.vue'
import { ref } from 'vue'

// In a real app, these would be imported from actual APIs
// import { genMindMap } from '@/api/chat';
// import { isBlank } from '@/utils/is';

const loading = ref(false)
const genText = ref('')

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
  } finally {
    loading.value = false
  }
}

function onRender(text: string) {
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