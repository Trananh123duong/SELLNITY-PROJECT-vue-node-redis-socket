import api from '@/utils/axios'

export const registerApi = (payload) => {
  return api.post('/auth/register', payload)
}

export const loginApi = (payload) => {
  return api.post('/auth/login', payload)
}

export const getProfileApi = () => {
  return api.get('/auth/my-profile')
}

export const refreshTokenApi = (token) => {
  return api.post('/auth/refresh', { token })
}

export const changePasswordApi = (payload) => {
  return api.patch('/auth/change-password', payload)
}

export const logoutApi = () => {
  return api.post('/auth/logout')
}