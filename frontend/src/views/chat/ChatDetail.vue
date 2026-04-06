<script setup>
import {
    getConversationDetailApi,
    sendMessageApi,
} from '@/api/conversation.api'
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()

const messages = ref([])
const conversation = ref(null)
const participants = ref([])
const loading = ref(false)
const sending = ref(false)
const messageInput = ref('')
const error = ref('')
const page = ref(1)
const hasMore = ref(false)
const loadingMore = ref(false)
const messageListRef = ref(null)

const conversationId = computed(() => route.params.id)
const currentUser = computed(() => authStore.user || null)

const otherUser = computed(() => {
    const currentUserId = Number(currentUser.value?.id)

    return (
        participants.value.find(
            (participant) => Number(participant.id) !== currentUserId
        ) || participants.value[0] || null
    )
})

const normalizeMessages = (messageItems = []) => {
    return messageItems.map((message) => ({
        ...message,
        conversationId:
            message.conversationId || message.conversation_id,
        createdAt: message.createdAt || message.created_at,
    }))
}

const scrollToBottom = async () => {
    await nextTick()
    messageListRef.value?.scrollToBottom()
}

// Lấy chi tiết conversation và map lại message theo thứ tự tăng dần để render chat
const fetchConversationDetail = async ({
    pageValue = 1,
    appendOldMessages = false,
} = {}) => {
    if (appendOldMessages) {
        loadingMore.value = true
    } else {
        loading.value = true
        error.value = ''
    }

    try {
        const response = await getConversationDetailApi(conversationId.value, {
            page: pageValue,
            limit: 20,
        })

        const responseData = response.data.data
        const normalizedMessages = normalizeMessages(responseData.messages)
        const sortedMessages = [...normalizedMessages].reverse()

        conversation.value = responseData.conversation
        participants.value = responseData.participants || []
        hasMore.value = responseData.pagination?.hasMore || false
        page.value = responseData.pagination?.page || pageValue

        if (appendOldMessages) {
            messages.value = [...sortedMessages, ...messages.value]
        } else {
            messages.value = sortedMessages
        }
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'Không thể tải chi tiết cuộc trò chuyện'
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

const handleLoadMore = async () => {
    if (!hasMore.value || loadingMore.value) {
        return
    }

    const previousHeight = messageListRef.value?.getScrollHeight() || 0

    await fetchConversationDetail({
        pageValue: page.value + 1,
        appendOldMessages: true,
    })

    await nextTick()

    const nextHeight = messageListRef.value?.getScrollHeight() || 0
    messageListRef.value?.setScrollTop(nextHeight - previousHeight)
}

const handleSendMessage = async () => {
    const trimmedMessage = messageInput.value.trim()

    if (!trimmedMessage) {
        return
    }

    sending.value = true

    try {
        const response = await sendMessageApi(conversationId.value, {
            content: trimmedMessage,
        })

        const newMessage = normalizeMessages([response.data.data])[0]

        messages.value = [...messages.value, newMessage]
        messageInput.value = ''

        if (conversation.value) {
            conversation.value = {
                ...conversation.value,
                updatedAt: newMessage.createdAt,
            }
        }

        await scrollToBottom()
    } finally {
        sending.value = false
    }
}

const handleRetry = async () => {
    await fetchConversationDetail()
    await scrollToBottom()
}

onMounted(async () => {
    await fetchConversationDetail()
    await scrollToBottom()
})
</script>

<template>
    <div class="chat-detail-page">
        <el-skeleton v-if="loading" :rows="8" animated />

        <el-empty v-else-if="error" :description="error" class="chat-error-state">
            <el-button type="primary" @click="handleRetry">
                Tải lại
            </el-button>
        </el-empty>

        <div v-else class="chat-card">
            <ChatHeader :other-user="otherUser" />

            <MessageList ref="messageListRef" :messages="messages" :current-user-id="currentUser?.id"
                :has-more="hasMore" :loading-more="loadingMore" @load-more="handleLoadMore" />

            <ChatInput v-model="messageInput" :sending="sending" @send="handleSendMessage" />
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
