import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  updateUserApi,
} from '@/api/user.api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await getUsersApi()
      users.value = response.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload) => {
    try {
      await createUserApi(payload)
    } catch (err) {
      error.value = err.message
    }
  }

  const updateUser = async (id, payload) => {
    try {
      await updateUserApi(id, payload)
    } catch (err) {
      error.value = err.message
    }
  }

  const deleteUser = async (id) => {
    try {
      await deleteUserApi(id)
      await fetchUsers()
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
})