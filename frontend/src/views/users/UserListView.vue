<script setup>
import UserTable from '@/components/users/UserTable.vue'
import { useUserStore } from '@/stores/user.store'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers()
})

const handleDelete = async (id) => {
  await userStore.deleteUser(id)
}
</script>

<template>
  <div>
    <h2>User List</h2>

    <router-link to="/users/create">
      Add User
    </router-link>

    <br /><br />

    <div v-if="userStore.loading">Loading...</div>

    <UserTable
      v-else
      :users="userStore.users"
      @delete="handleDelete"
    />
  </div>
</template>