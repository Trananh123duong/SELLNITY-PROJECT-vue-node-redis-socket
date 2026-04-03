import api from '@/utils/axios'

export const getUsersApi = () => {
  return api.get('/users')
}

export const createUserApi = (payload) => {
  return api.post('/users', payload)
}

export const updateUserApi = (id, payload) => {
  return api.put(`/users/${id}`, payload)
}

export const deleteUserApi = (id) => {
  return api.delete(`/users/${id}`)
}