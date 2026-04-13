import {
    createPrivateConversationApi,
    getConversationDetailApi,
    getConversationsApi,
    sendMessageApi,
} from '@/api/conversation.api'
import { getUsersApi, searchUsersApi } from '@/api/user.api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useAuthStore } from '@/stores/auth.store'
import {
    getSocket,
    joinConversation,
    leaveConversation,
    onNewMessage,
} from '@/services/socket'

const normalizeMessages = (messageItems = []) => {
  return messageItems.map((message) => ({
    ...message,
    conversationId:
      message.conversationId || message.conversation_id,
    createdAt: message.createdAt || message.created_at,
  }))
}

export const useConversationStore = defineStore('conversation', () => {
  const authStore = useAuthStore()

  const conversations = ref([])
  const conversationListLoading = ref(false)
  const conversationListError = ref('')

  const currentConversation = ref(null)
  const participants = ref([])
  const messages = ref([])
  const conversationLoading = ref(false)
  const conversationError = ref('')
  const page = ref(1)
  const limit = ref(20)
  const hasMore = ref(false)
  const loadingMore = ref(false)
  const sending = ref(false)

  const candidateUsers = ref([])
  const candidateUsersLoading = ref(false)
  const creatingRoom = ref(false)

  // Lưu hàm cleanup listener new-message để gỡ khi rời room
  let removeNewMessageListener = null

  const currentUserId = computed(() => Number(authStore.user?.id))

  const mapUsers = (responseData = []) => {
    return responseData.filter(
      (user) => Number(user.id) !== currentUserId.value
    )
  }

  const fetchConversations = async () => {
    conversationListLoading.value = true
    conversationListError.value = ''

    try {
      const response = await getConversationsApi()
      const responseData = response.data.data || []

      conversations.value = [...responseData].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )
    } catch (err) {
      conversationListError.value =
        err.response?.data?.message ||
        err.message
      throw err
    } finally {
      conversationListLoading.value = false
    }
  }

  const fetchConversationDetail = async (
    conversationId,
    { pageValue = 1, appendOldMessages = false } = {}
  ) => {
    if (appendOldMessages) {
      loadingMore.value = true
    } else {
      conversationLoading.value = true
      conversationError.value = ''
    }

    try {
      const response = await getConversationDetailApi(conversationId, {
        page: pageValue,
        limit: limit.value,
      })

      const responseData = response.data.data
      const normalizedMessages = normalizeMessages(
        responseData.messages
      )
      const sortedMessages = [...normalizedMessages].reverse()

      currentConversation.value = responseData.conversation
      participants.value = responseData.participants || []
      hasMore.value = responseData.pagination?.hasMore || false
      page.value = responseData.pagination?.page || pageValue

      if (appendOldMessages) {
        messages.value = [...sortedMessages, ...messages.value]
      } else {
        messages.value = sortedMessages

        // Tham gia socket room và đăng ký lắng nghe tin nhắn mới
        joinConversation(conversationId)

        if (removeNewMessageListener) {
          removeNewMessageListener()
        }

        removeNewMessageListener = onNewMessage((newMessage) => {
          const normalized = normalizeMessages([newMessage])[0]
          const alreadyExists = messages.value.some(
            (m) => m.id === normalized.id
          )
          if (!alreadyExists) {
            messages.value = [...messages.value, normalized]

            if (currentConversation.value) {
              currentConversation.value = {
                ...currentConversation.value,
                updatedAt: normalized.createdAt,
              }
            }
          }
        })
      }
    } catch (err) {
      conversationError.value =
        err.response?.data?.message ||
        err.message
      throw err
    } finally {
      conversationLoading.value = false
      loadingMore.value = false
    }
  }

  const loadMoreMessages = async (conversationId) => {
    if (!hasMore.value || loadingMore.value) {
      return
    }

    await fetchConversationDetail(conversationId, {
      pageValue: page.value + 1,
      appendOldMessages: true,
    })
  }

  const sendMessage = async (conversationId, content) => {
    const trimmedMessage = String(content || '').trim()

    if (!trimmedMessage) {
      return null
    }

    sending.value = true

    try {
      const response = await sendMessageApi(conversationId, {
        content: trimmedMessage,
      })

      const newMessage = normalizeMessages([
        response.data.data,
      ])[0]

      // Chỉ tự append khi socket không connected (fallback)
      // Bình thường socket event "new-message" sẽ append cho cả 2 phía
      const socket = getSocket()
      if (!socket?.connected) {
        messages.value = [...messages.value, newMessage]

        if (currentConversation.value) {
          currentConversation.value = {
            ...currentConversation.value,
            updatedAt: newMessage.createdAt,
          }
        }
      }

      return newMessage
    } finally {
      sending.value = false
    }
  }

  const fetchInitialUsers = async () => {
    candidateUsersLoading.value = true

    try {
      const response = await getUsersApi()
      candidateUsers.value = mapUsers(response.data.data || [])
    } catch (err) {
      candidateUsers.value = []
      throw err
    } finally {
      candidateUsersLoading.value = false
    }
  }

  const searchUsers = async (keyword = '') => {
    if (!keyword.trim()) {
      await fetchInitialUsers()
      return
    }

    candidateUsersLoading.value = true

    try {
      const response = await searchUsersApi(keyword)
      candidateUsers.value = mapUsers(response.data.data || [])
    } catch (err) {
      candidateUsers.value = []
      throw err
    } finally {
      candidateUsersLoading.value = false
    }
  }

  const createPrivateConversation = async (targetUserId) => {
    if (creatingRoom.value) {
      return null
    }

    creatingRoom.value = true

    try {
      const response = await createPrivateConversationApi({
        targetUserId,
      })

      return response.data.data?.conversationId || null
    } finally {
      creatingRoom.value = false
    }
  }

  const clearConversationDetail = () => {
    if (currentConversation.value?.id) {
      leaveConversation(currentConversation.value.id)
    }

    if (removeNewMessageListener) {
      removeNewMessageListener()
      removeNewMessageListener = null
    }

    currentConversation.value = null
    participants.value = []
    messages.value = []
    conversationError.value = ''
    page.value = 1
    hasMore.value = false
  }

  return {
    conversations,
    conversationListLoading,
    conversationListError,
    currentConversation,
    participants,
    messages,
    conversationLoading,
    conversationError,
    page,
    limit,
    hasMore,
    loadingMore,
    sending,
    candidateUsers,
    candidateUsersLoading,
    creatingRoom,
    fetchConversations,
    fetchConversationDetail,
    loadMoreMessages,
    sendMessage,
    fetchInitialUsers,
    searchUsers,
    createPrivateConversation,
    clearConversationDetail,
  }
})