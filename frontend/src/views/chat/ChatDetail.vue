<script setup>
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useConversationStore } from '@/stores/conversation.store'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const conversationStore = useConversationStore()
const {
  messages,
  participants,
  conversationLoading: loading,
  sending,
  conversationError: error,
  hasMore,
  loadingMore,
} = storeToRefs(conversationStore)

const messageInput = ref('')
const messageListRef = ref(null)

const conversationId = computed(() => route.params.id)
const currentUser = computed(() => authStore.user || null)

const otherUser = computed(() => {
  const currentUserId = Number(currentUser.value?.id)

  return (
    participants.value.find(
      (participant) => Number(participant.id) !== currentUserId
    ) ||
    participants.value[0] ||
    null
  )
})

const scrollToBottom = async () => {
  await nextTick()
  messageListRef.value?.scrollToBottom()
}

const handleLoadMore = async () => {
  if (!hasMore.value || loadingMore.value) {
    return
  }

  const previousHeight = messageListRef.value?.getScrollHeight() || 0

  await conversationStore.loadMoreMessages(conversationId.value)

  await nextTick()

  const nextHeight = messageListRef.value?.getScrollHeight() || 0
  messageListRef.value?.setScrollTop(nextHeight - previousHeight)
}

const handleSendMessage = async () => {
  try {
    const newMessage = await conversationStore.sendMessage(
      conversationId.value,
      messageInput.value
    )

    if (!newMessage) {
      return
    }

    messageInput.value = ''

    await scrollToBottom()
  } catch {
    ElMessage.error('Không thể gửi tin nhắn')
  }
}

const handleRetry = async () => {
  await conversationStore.fetchConversationDetail(conversationId.value)
  await scrollToBottom()
}

const initConversationDetail = async () => {
  await conversationStore.fetchConversationDetail(conversationId.value)
  await scrollToBottom()
}

onMounted(async () => {
  await initConversationDetail()
})

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await initConversationDetail()
    }
  }
)

onUnmounted(() => {
  conversationStore.clearConversationDetail()
})
</script>

<template>
  <div class="chat-detail-page">
    <el-skeleton v-if="loading" :rows="8" animated />

    <el-empty
      v-else-if="error"
      :description="error"
      class="chat-error-state"
    >
      <el-button type="primary" @click="handleRetry">
        Tải lại
      </el-button>
    </el-empty>

    <div v-else class="chat-card">
      <ChatHeader :other-user="otherUser" />

      <MessageList
        ref="messageListRef"
        :messages="messages"
        :current-user-id="currentUser?.id"
        :has-more="hasMore"
        :loading-more="loadingMore"
        @load-more="handleLoadMore"
      />

      <ChatInput
        v-model="messageInput"
        :sending="sending"
        @send="handleSendMessage"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-detail-page {
  max-width: 960px;
  margin: 0 auto;
}

.chat-card {
  background: #fff;
  border-radius: 16px;
}

.chat-error-state {
  padding: 32px 0;
}
</style>
