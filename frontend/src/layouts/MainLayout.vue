<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(
  () => authStore.isLoggedIn
)

const username = computed(
  () => authStore.user?.username
)

const goLogin = () => {
  router.push('/login')
}

const goRegister = () => {
  router.push('/register')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="main-layout">
    <header class="header">
      <h1>User Management</h1>

      <div class="header-actions">
        <template v-if="isLoggedIn">
          <span class="welcome">
            Xin chào, {{ username }}
          </span>

          <el-button
            type="danger"
            @click="handleLogout"
          >
            Logout
          </el-button>
        </template>

        <template v-else>
          <el-button @click="goLogin">
            Login
          </el-button>

          <el-button
            type="primary"
            @click="goRegister"
          >
            Register
          </el-button>
        </template>
      </div>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome {
  font-size: 14px;
  color: #606266;
}

.content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>