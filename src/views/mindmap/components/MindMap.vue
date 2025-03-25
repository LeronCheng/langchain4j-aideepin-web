<script setup lang="ts">
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import { onMounted, watch } from 'vue'
import { NButton } from 'naive-ui'

const props = defineProps<{
  genText: string
  loading: boolean
}>()

let instance: Markmap | null = null
onMounted(() => {
  const el = document.getElementById('mindmap') as any
  instance = Markmap.create(el)
})

watch(
  () => props.genText,
  val => {
    if (!val) return

    const transformer = new Transformer()
    const { root } = transformer.transform(val)
    instance?.setData(root)
    instance?.fit()
  }
)

function onZoomIn() {
  instance?.rescale(2)
}

function onZoomOut() {
  instance?.rescale(0.5)
}

function onZoomFill() {
  instance?.fit()
}

function downloadPng() {
  // Basic implementation - in a real app would use html2canvas or similar
  alert('功能待实现：下载PNG')
}

function downloadSvg() {
  // Basic implementation - in a real app would get SVG content and create download
  alert('功能待实现：下载SVG')
}

function downloadPdf() {
  // Basic implementation - in a real app would convert to PDF and download
  alert('功能待实现：下载PDF')
}
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
      <NButton round size="small" @click="downloadPng">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z" />
          </svg>
        </template>
        PNG
      </NButton>
      <NButton round size="small" @click="downloadSvg">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lg">
            <path fill="currentColor" d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7l7-7z" />
          </svg>
        </template>
        SVG
      </NButton>
      <NButton round size="small" @click="downloadPdf">
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
      <div class="text-2xl font-bold">思维导图</div>
      <div class="text-gray-400">在左侧输入内容，然后点击渲染按钮</div>
    </div>

    <div id="mindmap-view" class="h-full w-full">
      <svg id="mindmap" class="h-full w-full" />
    </div>
  </div>
</template>

<style scoped>
.dot-bg {
  background-image: radial-gradient(#ddd 1px, transparent 0);
  background-size: 20px 20px;
  background-position: -19px -19px;
}
</style> 