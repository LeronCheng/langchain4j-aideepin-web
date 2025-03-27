<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, watch } from 'vue'

const Sider = defineAsyncComponent(() => import('./components/Sider.vue'))
const MindMap = defineAsyncComponent(() => import('./components/MindMap.vue'))

// In a real app, these would be imported from actual APIs
// import { genMindMap } from '@/api/chat';
// import { isBlank } from '@/utils/is';

const text = ref('')
const genText = ref('')
const loading = ref(false)
const diagramType = ref('markdown') // 默认为 markdown

// 监视 genText 的变化
async function onGenerate(text: string) {
  if (!text || text.trim() === '') {
    return
  }

  loading.value = true
  try {
    // Call workflow API to generate sections
    const response = await fetch('http://192.168.50.83/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer app-4yZsIwlKy2VdM9OwhEuQmeqa'
      },
      body: JSON.stringify({
        inputs: {
          type: diagramType.value,
          input: text
        },
        response_mode: 'streaming',
        user: 'ee4c6ff9-b987-4867-9ca3-361312d81af9'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate sections')
    }

    // Handle SSE response
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let accumulatedOutput = ''

    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data)
            if (parsed.event === 'workflow_finished') {
              accumulatedOutput = parsed.data.outputs.output
              // 只在数据完全获取后更新 genText
              genText.value = accumulatedOutput
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }
  } catch (error) {
    alert('图表渲染失败')
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

// 切换图表类型
async function onDiagramTypeChange(type: string) {
  diagramType.value = type
  // 如果内容描述不为空，重新生成内容
  if (text.value && text.value.trim() !== '') {
    // 先清空当前内容
    genText.value = ''
    // 重新获取数据
    await onGenerate(text.value)
  }
}
</script>

<template>
  <div class="w-full flex h-full">
    <Sider :genText="genText" :loading="loading" @generate="onGenerate" @render="onRender" @diagramTypeChange="onDiagramTypeChange" />
    <MindMap :genText="genText" :loading="loading" :diagramType="diagramType" />
  </div>
</template>

<style scoped></style> 