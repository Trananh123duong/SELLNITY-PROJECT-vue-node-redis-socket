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
  <div>
    <h2>Create User</h2>
    <UserForm submit-text="Create" @submit="handleCreate" />
  </div>
</template>