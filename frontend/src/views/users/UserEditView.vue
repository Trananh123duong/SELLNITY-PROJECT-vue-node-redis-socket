<script setup>
import UserForm from '@/components/users/UserForm.vue'
import { useUserStore } from '@/stores/user.store'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const userId = route.params.id

onMounted(async () => {
  if (!userStore.users.length) {
    await userStore.fetchUsers()
  }
})

const currentUser = computed(() =>
  userStore.users.find((user) => user.id == userId)
)

const handleUpdate = async (payload) => {
  await userStore.updateUser(userId, payload)
  router.push('/users')
}
</script>

<template>
  <div class="user-form-page">
    <el-card shadow="hover" class="form-card">
      <template #header>
        <h2>Edit User</h2>
      </template>

      <UserForm
        :initial-values="currentUser"
        submit-text="Update"
        @submit="handleUpdate"
      />
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