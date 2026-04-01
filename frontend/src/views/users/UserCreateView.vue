<script setup>
import UserForm from '@/components/users/UserForm.vue'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleCreate = async (payload) => {
  await userStore.createUser(payload)
  router.push('/users')
}
</script>

<template>
  <div class="user-form-page">
    <el-card shadow="hover" class="form-card">
      <template #header>
        <h2>Create User</h2>
      </template>

      <UserForm submit-text="Create" @submit="handleCreate" />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.user-form-page {
  max-width: 700px;
  margin: 0 auto;
}

.form-card {
  border-radius: 16px;
}
</style>