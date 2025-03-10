import type { GlobalThemeOverrides } from 'naive-ui'
import { computed, watch } from 'vue'
import { darkTheme, useOsTheme } from 'naive-ui'
import { useAppStore } from '@/store'

export function useTheme() {
  const appStore = useAppStore()

  const OsTheme = useOsTheme()

  const isDark = computed(() => {
    if (appStore.theme === 'auto')
      return OsTheme.value === 'dark'
    else
      return appStore.theme === 'dark'
  })

  const theme = computed(() => {
    return isDark.value ? darkTheme : undefined
  })

  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    if (isDark.value) {
      return {
        common: {
          primaryColor: '#001529', // 自定义深色主题的主色
          primaryColorHover: '#001529', // 自定义深色主题的主色悬停状态
          primaryColorPressed: '#001529', // 自定义深色主题的主色按下状态
        },
      }
    }
    return {
      common: {
        primaryColor: '#2379a6', // 自定义浅色主题的主色
        primaryColorHover: '#2379a6', // 自定义浅色主题的主色悬停状态
        primaryColorPressed: '#2379a6', // 自定义浅色主题的主色按下状态
      },
    }
  })

  watch(
    () => isDark.value,
    (dark) => {
      if (dark)
        document.documentElement.classList.add('dark')
      else
        document.documentElement.classList.remove('dark')
    },
    { immediate: true },
  )

  return { theme, themeOverrides }
}
