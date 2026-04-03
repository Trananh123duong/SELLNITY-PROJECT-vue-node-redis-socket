<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  full_name: '',
  password: '',
  phone: '',
})

const handleRegister = async () => {
  try {
    await authStore.register(form)

    ElMessage.success('Đăng ký thành công 🎉')

    router.push('/')
  } catch {
    ElMessage.error(
      authStore.error || 'Đăng ký thất bại'
    )
  }
}

const goLogin = () => {
  router.push('/')
}
</script>

<template>
  <div class="register-page">
    <el-card class="register-card" shadow="hover">
      <div class="card-header">
        <h2>Đăng ký tài khoản</h2>
        <p>Tạo tài khoản mới để bắt đầu 🚀</p>
      </div>

      <el-form
        class="register-form"
        label-width="110px"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="Username">
          <el-input
            v-model="form.username"
            size="large"
            placeholder="Nhập username"
          />
        </el-form-item>

        <el-form-item label="Họ tên">
          <el-input
            v-model="form.full_name"
            size="large"
            placeholder="Nhập họ tên"
          />
        </el-form-item>

        <el-form-item label="Email">
          <el-input
            v-model="form.email"
            size="large"
            placeholder="Nhập email"
          />
        </el-form-item>

        <el-form-item label="Số điện thoại">
          <el-input
            v-model="form.phone"
            size="large"
            placeholder="Nhập số điện thoại"
          />
        </el-form-item>

        <el-form-item label="Mật khẩu">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            size="large"
            placeholder="Nhập mật khẩu"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          :loading="authStore.loading"
          class="register-btn"
          @click="handleRegister"
        >
          Đăng ký
        </el-button>
      </el-form>

      <div class="footer-action">
        <span>Đã có tài khoản?</span>
        <el-button
          type="primary"
          link
          @click="goLogin"
        >
          Đăng nhập ngay
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  width: 520px;
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

.register-form {
  margin-top: 12px;
}

.register-btn {
  width: 100%;
  margin-top: 12px;
}

.footer-action {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}
</style>