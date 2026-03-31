import apiClient from './axios'

export const getUsersApi = () => {
  return apiClient.get('/users')
}

export const createUserApi = (payload) => {
  return apiClient.post('/users', payload)
}

export const updateUserApi = (id, payload) => {
  return apiClient.put(`/users/${id}`, payload)
}

export const deleteUserApi = (id) => {
  return apiClient.delete(`/users/${id}`)
}