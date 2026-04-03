import {
  changePasswordApi,
  getProfileApi,
  loginApi,
  logoutApi,
  refreshTokenApi,
  registerApi,
} from '@/api/auth.api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => !!accessToken.value)

  const register = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const response = await registerApi(payload)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const response = await loginApi(payload)

      user.value = response.data.user
      accessToken.value = response.data.accessToken
      refreshToken.value = response.data.refreshToken

      localStorage.setItem(
        'accessToken',
        response.data.accessToken
      )

      localStorage.setItem(
        'refreshToken',
        response.data.refreshToken
      )

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getMyProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await getProfileApi()
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await refreshTokenApi(
        refreshToken.value
      )

      accessToken.value = response.data.accessToken

      localStorage.setItem(
        'accessToken',
        response.data.accessToken
      )

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    }
  }

  const changePassword = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const response = await changePasswordApi(payload)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await logoutApi()
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      user.value = null
      accessToken.value = null
      refreshToken.value = null

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      loading.value = false
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isLoggedIn,
    register,
    login,
    getMyProfile,
    refreshAccessToken,
    changePassword,
    logout,
  }
})