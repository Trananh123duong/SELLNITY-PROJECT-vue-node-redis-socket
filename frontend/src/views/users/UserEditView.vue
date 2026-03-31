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
  <div>
    <h2>Edit User</h2>

    <UserForm
      :initial-values="currentUser"
      submit-text="Update"
      @submit="handleUpdate"
    />
  </div>
</template>