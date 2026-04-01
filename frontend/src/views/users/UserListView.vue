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
  <div class="user-list">
    <div class="top-bar">
      <h2>User List</h2>

      <router-link to="/users/create">
        <el-button type="primary">
          Add User
        </el-button>
      </router-link>
    </div>

    <el-skeleton v-if="userStore.loading" :rows="5" animated />

    <UserTable
      v-else
      :users="userStore.users"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.user-list {
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
  }
}
</style>