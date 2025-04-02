<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted, watch } from 'vue'
import LoginTip from '@/views/user/LoginTip.vue'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const Sider = defineAsyncComponent(() => import('./components/Sider.vue'))
const MindMap = defineAsyncComponent(() => import('./components/MindMap.vue'))

// In a real app, these would be imported from actual APIs
// import { genMindMap } from '@/api/chat';
// import { isBlank } from '@/utils/is';

const text = ref('')
const genText = ref('')
const loading = ref(false)

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
        Authorization: 'Bearer app-fKd4EJWJbezTmc9KygdlhvXM'
      },
      body: JSON.stringify({
        inputs: {
          style: '蓝色',
          input: text
        },
        response_mode: 'streaming',
        user: 'a83fb08e-af48-444b-8b4b-8ac6e75d6cea'
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
</script>

<template>
  <div v-if="!authStore.token" class="w-full h-full">
    <LoginTip />
  </div>
  <div v-else class="w-full flex h-full">
    <Sider :genText="genText" :loading="loading" @generate="onGenerate" @render="onRender" />
    <MindMap :genText="genText" :loading="loading" />
  </div>
</template>

<style scoped></style>
