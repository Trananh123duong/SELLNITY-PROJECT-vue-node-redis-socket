<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { connectSocket } from '@/services/socket'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isLoggedIn) {
    connectSocket()
  }
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
