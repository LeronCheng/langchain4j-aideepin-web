<script setup lang="ts">
import { NButton, NConfigProvider, NIcon, NLayout, NLayoutSider, NMenu, NSpace, NTooltip } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { defineAsyncComponent, h, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppsOutline, ChatboxEllipsesOutline, ColorPaletteOutline, ImagesOutline, LibraryOutline, MapOutline, PersonCircleOutline, SearchOutline, SettingsOutline, BarChartOutline, Image, Heart, Wine } from '@vicons/ionicons5'
import agent from '@/assets/agent.png'
import echat from '@/assets/echat.png'
import imageProcess from '@/assets/imageProcess.png'
import { Prompt as PromptIcon } from '@vicons/tabler'
import { NaiveProvider, PromptStore } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { t } from '@/locales'
import { useAppStore, useAuthStore, useChatStore, useKbStore, useWfStore } from '@/store'
import Login from '@/views/user/Login.vue'
import api from '@/api'

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))

const appStore = useAppStore()
const chatStore = useChatStore()
const kbStore = useKbStore()
const wfStore = useWfStore()
const authStore = useAuthStore()
const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
const route = useRoute()
const routeName = route.name as string
console.log(`menu-${routeName.toLowerCase()}`)
const activeKey = ref<string>('menu-chat')
const showPrompt = ref<boolean>(false)
const showSetting = ref<boolean>(false)

const menuKeyToRouteNames = new Map<string, string[]>([
  ['chat', ['Chat', 'ChatDetail']],
  ['draw', ['Draw']],
  ['gallery', ['Root', 'Gallery']],
  ['knowledge-base', ['QAIndex', 'QADetail', 'KnowledgeBaseManage', 'KnowledgeBaseManageDetail']],
  ['workflow', ['WfDetail']],
  ['mindmap', ['Mindmap']],
  ['pptgeneration', ['PPTGeneration']],
  ['agent', ['Agent']],
  ['imageProcess', ['ImageProcess']],
  ['aisearch', ['AiSearch']]
])

menuKeyToRouteNames.forEach((val, key) => {
  if (val.includes(routeName)) activeKey.value = `menu-${key.toLowerCase()}`
})

const menuOptions: MenuOption[] = [
  {
    key: 'menu-chat',
    icon: renderIcon(ChatboxEllipsesOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'ChatDetail',
            params: {
              uuid: chatStore.active
            }
          }
        },
        { default: () => '聊天' }
      )
  },
  {
    key: 'menu-draw',
    icon: renderIcon(ColorPaletteOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Draw'
          }
        },
        { default: () => '绘画' }
      )
  },
  {
    key: 'menu-gallery',
    icon: renderIcon(ImagesOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Gallery'
          }
        },
        { default: () => '画廊' }
      )
  },
  {
    key: 'menu-knowledge-base',
    icon: renderIcon(LibraryOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'QADetail',
            params: {
              kbUuid: kbStore.activeKbUuid
            }
          }
        },
        { default: () => '知识库' }
      )
  },
  {
    key: 'menu-workflow',
    icon: renderIcon(AppsOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'WfDetail',
            params: {
              uuid: wfStore.activeUuid
            }
          }
        },
        { default: () => '应用' }
      )
  },
  {
    key: 'menu-mindmap',
    icon: renderIcon(BarChartOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Mindmap'
          }
        },
        { default: () => '图表' }
      )
  },
  {
    key: 'menu-agent',
    icon: renderIcon(Heart),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Agent'
          }
        },
        { default: () => '智能体' }
      )
  },
  {
    key: 'menu-pptgeneration',
    icon: renderIcon(Wine),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'PPTGeneration'
          }
        },
        { default: () => 'ppt生成' }
      )
  },
  {
    key: 'menu-imageProcess',
    icon: renderIcon(Image),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'ImageProcess'
          }
        },
        { default: () => '图像处理' }
      )
  },
  {
    key: 'menu-aisearch',
    icon: renderIcon(SearchOutline),
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'AiSearch'
          }
        },
        { default: () => '搜索' }
      )
  }
]
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

onMounted(async () => {
  const llms = await api.loadLLMs<AiModelInfo[]>()
  appStore.setLLMs(llms.data)
  const imageModels = await api.loadImageModels<AiModelInfo[]>()
  appStore.setImageModels(imageModels.data)
  const engines = await api.loadSearchEngines<SearchEngineInfo[]>()
  appStore.setSearchEngines(engines.data)
})
</script>

<template>
  <NConfigProvider class="h-full" :theme="theme" :theme-overrides="themeOverrides" :locale="language">
    <NaiveProvider>
      <NLayout class="h-full" has-sider>
        <NLayoutSider bordered :collapsed-width="48" collapse-mode="width" :collapsed="true">
          <NMenu v-model:value="activeKey" :options="menuOptions" />
          <NSpace vertical class="absolute bottom-0 ml-2">
            <NTooltip trigger="hover" placement="right" style="margin-left: 1.5rem;">
              <template #trigger>
                <NButton text style="font-size: 26px;" class="cursor-pointer" @click="showPrompt = true">
                  <NIcon>
                    <PromptIcon />
                  </NIcon>
                </NButton>
              </template>
              {{ t('store.siderButton') }}
            </NTooltip>
            <NTooltip v-if="authStore.token" trigger="hover" placement="right" style="margin-left: 1.5rem;">
              <template #trigger>
                <NButton text style="font-size: 26px;" class="cursor-pointer" @click="showSetting = true">
                  <NIcon>
                    <SettingsOutline />
                  </NIcon>
                </NButton>
              </template>
              {{ t('setting.setting') }}
            </NTooltip>
            <NTooltip v-if="!authStore.token" trigger="hover" placement="right" style="margin-left: 1.5rem;">
              <template #trigger>
                <NButton text style="font-size: 26px;" class="cursor-pointer" @click="authStore.setLoginView(true)">
                  <NIcon>
                    <PersonCircleOutline />
                  </NIcon>
                </NButton>
              </template>
              登录
            </NTooltip>
          </NSpace>
        </NLayoutSider>
        <NLayout>
          <!-- <KeepAlive>
            <RouterView :key="routePath" />
          </KeepAlive> -->
          <RouterView v-slot="{ Component, route }">
            <KeepAlive>
              <component :is="Component" :key="route.fullPath" />
            </KeepAlive>
          </RouterView>
        </NLayout>
      </NLayout>

      <PromptStore v-model:visible="showPrompt" />
      <Setting v-model:visible="showSetting" />
      <Login />
    </NaiveProvider>
  </NConfigProvider>
</template>
