<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NMenu, useMessage } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useAuthStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import LoginTip from '@/views/user/LoginTip.vue'

interface AgentType {
  id: string
  name: string
  description: string
  url: string
}

const message = useMessage()
const authStore = useAuthStore()
const { isMobile } = useBasicLayout()
const mouseEnterId = ref<string>('')

const agentTypes = ref<AgentType[]>([
  {
    id: '1',
    name: 'ERP实施专家',
    description: 'ERP实施专家',
    url: 'http://192.168.50.83/chatbot/pnUgGjEYB1PRIdyG'
  },
  {
    id: '2',
    name: 'MES数据分析师',
    description: 'MES数据分析师',
    url: 'http://192.168.50.83/chatbot/RT21PbdzXRFCZErJ'
  }
])
const selectedAgent = ref<AgentType | null>(agentTypes.value[0])
const selectedAgentId = ref<string>(agentTypes.value[0].id)
const loading = ref(false)

// 处理鼠标进入
function handleMouseEnter(item: AgentType) {
  mouseEnterId.value = item.id
}

// 处理鼠标离开
function handleMouseLeave() {
  mouseEnterId.value = ''
}

// 处理选择
function handleSelect(item: AgentType) {
  selectedAgent.value = item
  selectedAgentId.value = item.id
}

// 获取智能体类型列表
async function fetchAgentTypes() {
  if (!authStore.checkLoginOrShow()) return

  loading.value = true
  try {
    const response = await fetch('http://192.168.50.83/v1/agents/types', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch agent types')
    }
    const data = await response.json()
    agentTypes.value = data.types
    // 默认选中第一个
    if (agentTypes.value.length > 0) {
      selectedAgent.value = agentTypes.value[0]
      selectedAgentId.value = agentTypes.value[0].id
    }
  } catch (error) {
    console.error('Error fetching agent types:', error)
    message.error('获取智能体类型失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // fetchAgentTypes()
})
</script>

<template>
  <div v-if="!authStore.token" class="w-full h-full">
    <LoginTip />
  </div>
  <div v-else class="w-full h-full flex">
    <!-- 左侧名称列表 -->
    <div class="w-64 h-full border-r border-gray-200 p-4">
      <h2 class="text-base font-semibold mb-4 text-center border-b border-dashed border-gray-300 pb-2">智能体模型</h2>
      <div class="flex flex-col gap-2 text-sm">
        <div v-for="item of agentTypes" :key="item.id">
          <a class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]" :class="selectedAgentId === item.id && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]']" @click="handleSelect(item)" @mouseenter="handleMouseEnter(item)" @mouseleave="handleMouseLeave">
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <span>{{ item.name }}</span>
            </div>
            <div v-if="mouseEnterId === item.id || isMobile" class="absolute z-10 flex visible right-1 pd-2">
              <button class="p-1">
                <SvgIcon icon="carbon:edit" />
              </button>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- 右侧 iframe -->
    <div class="flex-1 h-full overflow-hidden">
      <iframe :src="selectedAgent?.url || 'http://192.168.50.83/chatbot/pnUgGjEYB1PRIdyG'" class="w-full h-full border-0" frameborder="0" allow="microphone"></iframe>
    </div>
  </div>
</template>

<style scoped>
.n-menu {
  height: calc(100vh - 80px);
  overflow-y: auto;
}
</style> 