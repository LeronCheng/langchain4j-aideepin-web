<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LoginTip from '@/views/user/LoginTip.vue'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()

onMounted(() => {
  // fetchAgentTypes()
})
</script>

<template>
  <div v-if="!authStore.token" class="w-full h-full">
    <LoginTip />
  </div>
  <div v-else class="w-full h-full flex">
    <!-- <div class="flex-1 h-full overflow-hidden"> -->
    <iframe src="http://192.168.50.76:8088/" class="w-full h-full border-0" frameborder="0" allow="microphone"></iframe>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.n-menu {
  height: calc(100vh - 80px);
  overflow-y: auto;
}
</style> 