import api from '@/utils/axios'

export const getConversationsApi = () => {
  return api.get('/conversations')
}

export const getConversationDetailApi = (id, params) => {
  return api.get(`/conversations/${id}`, {
    params,
  })
}

export const createPrivateConversationApi = (payload) => {
  return api.post('/conversations/private', payload)
}

export const sendMessageApi = (conversationId, payload) => {
  return api.post(`/conversations/${conversationId}/messages`, payload)
}



