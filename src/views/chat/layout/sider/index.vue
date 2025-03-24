<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NLayoutSider, useMessage } from 'naive-ui'
import List from './List.vue'
import CreateConv from './CreateConv.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import api from '@/api'

const appStore = useAppStore()
const chatStore = useChatStore()
const ms = useMessage()
const createConvRef = ref()
const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const convList = computed(() => chatStore.conversations)

function handleAdd(this: any) {
  if (chatStore.allConvsCount >= 50) {
    ms.warning(t('chat.converstaionReachLimit50'), {
      duration: 1000,
    })
    return
  }
  if (createConvRef.value && createConvRef.value.toggleModal)
    createConvRef.value.toggleModal()
}

async function handleChatAdd() {
  if (chatStore.allConvsCount >= 50) {
    ms.warning(t('chat.converstaionReachLimit50'), {
      duration: 1000,
    })
    return
  }
  // 获取到源对话列表中title包含new chat的title，并获取new chat后面的数字
  const titleListNum = convList.value
    .filter((item: any) => item.title.includes('new chat'))
    .map((item: any) => {
      const match = item.title.match(/new chat(.*)/)
      return match[1] ? parseInt(match[1].trim()) : 0
    })
  const maxNum = Math.max(...titleListNum)
  const tmpTitle = ref(`new chat${maxNum + 1}`)
  const params = { title: tmpTitle.value, remark: '', aiSystemMessage: '' }
  try {
    const { data: newConv } = await api.convAdd<Chat.Conversation>(params)
    chatStore.addConv(newConv)
  } catch (error: any) {
    console.log('addConv error', error)
    if (error.message) {
      ms.error(error.message, {
        duration: 2000,
      })
    }
  }
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider :collapsed="collapsed" :collapsed-width="0" :width="260" :show-trigger="isMobile ? false : true" position="absolute" bordered :style="getMobileClass" @update-collapsed="handleUpdateCollapsed">
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
          <NButton style="margin-top: 8px" dashed block @click="handleChatAdd">
            新建对话
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <!-- <div class="p-4">
          <NButton block @click="show = true">
            {{ $t('store.siderButton') }}
          </NButton>
        </div> -->
      </main>
      <!-- <Footer /> -->
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <CreateConv ref="createConvRef" />
</template>
