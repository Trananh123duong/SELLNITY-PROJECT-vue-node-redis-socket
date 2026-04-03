<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await authStore.login(form)

    ElMessage.success('Đăng nhập thành công 🎉')

    router.push('/users')
  } catch {
    ElMessage.error(
      authStore.error || 'Đăng nhập thất bại'
    )
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <div class="card-header">
        <h2>Đăng nhập</h2>
        <p>Chào mừng bạn quay lại 👋</p>
      </div>

      <el-form
        class="login-form"
        label-width="90px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Email">
          <el-input
            v-model="form.email"
            placeholder="Nhập email"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Mật khẩu">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="Nhập mật khẩu"
            size="large"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          :loading="authStore.loading"
          @click="handleLogin"
          class="login-btn"
        >
          Đăng nhập
        </el-button>
      </el-form>

      <div class="footer-action">
        <span>Chưa có tài khoản?</span>
        <el-button
          type="primary"
          link
          @click="goRegister"
        >
          Đăng ký ngay
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 420px;
  border-radius: 18px;
  padding: 12px;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #303133;
  }

  p {
    margin-top: 8px;
    color: #909399;
    font-size: 14px;
  }
}

.login-form {
  margin-top: 12px;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.footer-action {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}
</style>