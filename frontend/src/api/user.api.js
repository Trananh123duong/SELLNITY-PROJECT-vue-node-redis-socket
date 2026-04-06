import api from '@/utils/axios'

export const getUsersApi = (params) => {
  return api.get('/users', {
    params,
  })
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

export const searchUsersApi = (keyword) => {
  return api.get('/users', {
    params: {
      search: keyword,
    },
  })
}
