<script setup lang="ts">
import { defineProps, nextTick, onMounted, ref, watch, onUnmounted } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import { NButton } from 'naive-ui'
import mermaid from 'mermaid'
import * as echarts from 'echarts'
import { downloadPdf, downloadPng, downloadSvg } from '@/utils/downloadFile'

const props = defineProps({
  genText: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  diagramType: {
    type: String,
    default: 'markdown'
  }
})

const markmapSvg = ref<SVGElement | null>(null)
const markmap = ref<any>(null)
const mermaidContainer = ref<HTMLElement | null>(null)
const isMermaid = ref(false)
const mermaidScale = ref(1)
const mermaidTranslateX = ref(0)
const mermaidTranslateY = ref(0)
const isDragging = ref(false)
const startDragX = ref(0)
const startDragY = ref(0)

// 添加 ECharts 相关变量
const echartsContainer = ref<HTMLElement | null>(null)
let echartsInstance: echarts.ECharts | null = null

// 检查内容是否为 Mermaid 格式
const checkIfMermaid = (text: string): boolean => {
  if (!text) return false

  // 如果明确指定了图表类型，则优先使用指定类型
  if (props.diagramType === 'mermaid') return true
  if (props.diagramType === 'markdown') return false

  // 否则尝试自动检测
  return text.trim().startsWith('```mermaid') || text.includes('flowchart') || text.includes('graph')
}

// 从 Markdown 文本中提取 Mermaid 内容
const extractMermaidContent = (text: string): string => {
  if (text.trim().startsWith('```mermaid')) {
    const match = text.match(/```mermaid\s*([\s\S]*?)```/)
    return match ? match[1].trim() : ''
  }
  return text.trim()
}

// 清除 Mermaid 容器
const clearMermaidContainer = () => {
  if (mermaidContainer.value) {
    mermaidContainer.value.innerHTML = ''
  }
}

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  if (!props.genText || !mermaidContainer.value) return

  clearMermaidContainer()
  isMermaid.value = true
  // 重置缩放和平移状态
  mermaidScale.value = 1
  mermaidTranslateX.value = 0
  mermaidTranslateY.value = 0

  try {
    // 初始化 Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })

    const mermaidContent = extractMermaidContent(props.genText)

    // 创建包装容器，用于实现缩放和拖动
    const wrapperDiv = document.createElement('div')
    wrapperDiv.className = 'mermaid-wrapper'
    mermaidContainer.value.appendChild(wrapperDiv)

    // 生成唯一 ID
    const id = `mermaid-${Date.now()}`
    wrapperDiv.innerHTML = `<div id="${id}"></div>`

    // 渲染 Mermaid 图表
    await nextTick()
    const { svg } = await mermaid.render(id, mermaidContent)
    wrapperDiv.innerHTML = svg

    // 添加滚轮缩放事件监听器
    wrapperDiv.addEventListener('wheel', handleMermaidWheel)
    // 添加拖动事件
    wrapperDiv.addEventListener('mousedown', startDrag)
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', endDrag)

    // 应用初始变换
    applyMermaidTransform()
  } catch (error) {
    alert('Mermaid 格式错误，请检查语法')
    mermaidContainer.value.innerHTML = `<div class="error">Mermaid格式错误</div>`
  }
}

// 处理 Mermaid 图表的滚轮缩放
const handleMermaidWheel = e => {
  if (!isMermaid.value) return
  e.preventDefault()

  const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9
  mermaidScale.value = Math.max(0.5, Math.min(3, mermaidScale.value * scaleFactor))

  applyMermaidTransform()
}

// 开始拖动 Mermaid 图表
const startDrag = e => {
  if (!isMermaid.value) return
  isDragging.value = true
  startDragX.value = e.clientX - mermaidTranslateX.value
  startDragY.value = e.clientY - mermaidTranslateY.value
}

// 拖动 Mermaid 图表
const drag = e => {
  if (!isDragging.value || !isMermaid.value) return
  mermaidTranslateX.value = e.clientX - startDragX.value
  mermaidTranslateY.value = e.clientY - startDragY.value
  applyMermaidTransform()
}

// 结束拖动 Mermaid 图表
const endDrag = () => {
  isDragging.value = false
}

// 应用 Mermaid 变换
const applyMermaidTransform = () => {
  if (!mermaidContainer.value) return

  const wrapper = mermaidContainer.value.querySelector('.mermaid-wrapper') as HTMLElement
  if (wrapper) {
    wrapper.style.transform = `translate(${mermaidTranslateX.value}px, ${mermaidTranslateY.value}px) scale(${mermaidScale.value})`
  }
}

// 渲染 Markmap
const renderMarkmap = () => {
  if (!props.genText || !markmapSvg.value) return

  isMermaid.value = false

  try {
    const el = markmapSvg.value
    el.innerHTML = ''
    const transformer = new Transformer()
    const { root } = transformer.transform(props.genText)

    markmap.value = Markmap.create(el, undefined, root)
    console.log('Markmap rendered with content length:', props.genText.length)
  } catch (error) {
    console.error('Markmap rendering error:', error)
    if (markmapSvg.value) {
      markmapSvg.value.innerHTML = `<div class="error">Markmap 格式错误</div>`
    }
  }
}

// 检查是否是 ECharts 配置
const checkIfECharts = (text: string): boolean => {
  try {
    const config = JSON.parse(text)
    return config && config.series && Array.isArray(config.series)
  } catch {
    return false
  }
}

// 渲染 ECharts 图表
const renderECharts = () => {
  if (!props.genText || !echartsContainer.value) return

  try {
    const config = JSON.parse(props.genText)

    // 如果已有实例，先销毁
    if (echartsInstance) {
      echartsInstance.dispose()
    }

    // 创建新实例
    echartsInstance = echarts.init(echartsContainer.value, null, {
      renderer: 'canvas',
      width: 'auto',
      height: 'auto'
    })

    // 设置图表配置
    const option = {
      ...config,
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    }

    echartsInstance.setOption(option)

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      echartsInstance?.resize()
    })
  } catch (error) {
    console.error('ECharts rendering error:', error)
    alert('ECharts 配置格式错误，请检查 JSON 格式')
    if (echartsContainer.value) {
      echartsContainer.value.innerHTML = `<div class="error">ECharts 格式错误</div>`
    }
  }
}

// 处理内容渲染
const renderContent = () => {
  // 如果内容为空，清空所有容器
  if (!props.genText || props.genText.trim() === '') {
    if (markmapSvg.value) {
      markmapSvg.value.innerHTML = ''
    }
    if (mermaidContainer.value) {
      mermaidContainer.value.innerHTML = ''
    }
    if (echartsContainer.value) {
      echartsContainer.value.innerHTML = ''
    }
    isMermaid.value = false
    return
  }

  if (checkIfMermaid(props.genText)) {
    renderMermaid()
  } else if (checkIfECharts(props.genText)) {
    renderECharts()
  } else {
    renderMarkmap()
  }
}

onMounted(() => {
  renderContent()
})

// 当组件卸载时移除事件监听器
const cleanupEventListeners = () => {
  if (mermaidContainer.value) {
    const wrapper = mermaidContainer.value.querySelector('.mermaid-wrapper')
    if (wrapper) {
      wrapper.removeEventListener('wheel', handleMermaidWheel)
      wrapper.removeEventListener('mousedown', startDrag)
    }
  }
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', endDrag)
}

watch(
  () => [props.genText, props.diagramType],
  () => {
    console.log('genText or diagramType changed in MindMap component')
    // 在重新渲染前清理事件监听器
    cleanupEventListeners()
    renderContent()
  },
  { deep: true }
)

// 放大 Mermaid 图表
function onZoomIn() {
  if (isMermaid.value) {
    mermaidScale.value = Math.min(3, mermaidScale.value * 1.25)
    applyMermaidTransform()
    return
  }

  if (markmap.value) {
    markmap.value.rescale(1.25)
  }
}

// 缩小 Mermaid 图表
function onZoomOut() {
  if (isMermaid.value) {
    mermaidScale.value = Math.max(0.5, mermaidScale.value * 0.8)
    applyMermaidTransform()
    return
  }

  if (markmap.value) {
    markmap.value.rescale(0.8)
  }
}

// 重置 Mermaid 图表
function onZoomFill() {
  if (isMermaid.value) {
    mermaidScale.value = 1
    mermaidTranslateX.value = 0
    mermaidTranslateY.value = 0
    applyMermaidTransform()
    return
  }

  if (markmap.value) {
    markmap.value.fit()
  }
}

// 保持原有下载方法不变
function downPng() {
  // 简单的下载实现
  downloadPng('mindmap-view', 'mindmap-shot')
}

function downSvg() {
  // 简单的下载实现
  downloadSvg('mindmap-view', 'mindmap-shot')
}

function downPdf() {
  // 简单的下载实现
  downloadPdf('mindmap-view', 'mindmap-shot')
}

// 修改 onUnmounted
onUnmounted(() => {
  if (echartsInstance) {
    echartsInstance.dispose()
    window.removeEventListener('resize', () => {
      echartsInstance?.resize()
    })
  }
})
</script>

<template>
  <div class="dot-bg w-full h-full relative">
    <div class="top-4 z-10 flex left-2 absolute flex-wrap justify-center gap-2">
      <NButton text @click="onZoomIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-2xl">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z" />
          <path fill="currentColor" d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
        </svg>
      </NButton>
      <NButton text @click="onZoomOut">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-2xl">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z" />
          <path fill="currentColor" d="M7 9v1h5V9H7z" />
        </svg>
      </NButton>
      <NButton text @click="onZoomFill">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-2xl">
          <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
      </NButton>
      <NButton round size="small" @click="downPng">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z" />
          </svg>
        </template>
        PNG
      </NButton>
      <NButton round size="small" @click="downSvg">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z" />
          </svg>
        </template>
        SVG
      </NButton>
      <NButton round size="small" @click="downPdf">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z" />
          </svg>
        </template>
        PDF
      </NButton>
    </div>

    <div v-if="genText == ''" class="h-full w-full flex flex-col justify-center items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" class="text-6xl">
        <path fill="currentColor" d="M14 17h-4v-1h4v1m-4-3h4v-1h-4v1m-3-8v10h10V6H7m8 2v2h-2V8h-2v2h2v2h2v-2h2V8h-2M3 8h2v12h12v2H3V8z" />
      </svg>
      <div class="text-2xl font-bold"> {{ props.diagramType == 'markdown' ? '思维导图' : '流程图' }}</div>
      <div class="text-gray-400">在左侧输入内容，然后点击渲染按钮</div>
    </div>

    <div id="mindmap-view" class="h-full w-full pt-12">
      <!-- Markmap 容器 -->
      <svg ref="markmapSvg" id="mindmap" class="h-full w-full" :style="{ display: props.diagramType === 'markdown' ? 'block' : 'none' }"></svg>

      <!-- Mermaid 容器 -->
      <div ref="mermaidContainer" class="mermaid-container h-full w-full" :style="{ display: props.diagramType === 'mermaid' ? 'block' : 'none' }"></div>

      <!-- ECharts 容器 -->
      <div ref="echartsContainer" class="echarts-container h-full w-full" :style="{ display: props.diagramType === 'charts' ? 'block' : 'none' }"></div>
    </div>
  </div>
</template>

<style scoped>
.dot-bg {
  background-image: radial-gradient(#ddd 1px, transparent 0);
  background-size: 20px 20px;
  background-position: -19px -19px;
}

.mermaid-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden; /* 防止滚动，使拖动更顺畅 */
  position: relative;
}

.mermaid-wrapper {
  transform-origin: center center;
  transition: transform 0.1s ease-out;
  cursor: grab;
}

.mermaid-wrapper:active {
  cursor: grabbing;
}

.error {
  color: red;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
  background-color: rgba(255, 0, 0, 0.05);
}

.echarts-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: calc(100% - 36px); /* 减小顶部间距 */
  margin-top: 36px; /* 减小顶部边距 */
}
</style> 