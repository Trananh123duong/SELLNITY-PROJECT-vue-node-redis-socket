<script setup>
import MessageBubble from '@/components/chat/MessageBubble.vue'
import { computed, ref } from 'vue'

const props = defineProps({
    messages: {
        type: Array,
        default: () => [],
    },
    currentUserId: {
        type: [Number, String],
        default: null,
    },
    hasMore: {
        type: Boolean,
        default: false,
    },
    loadingMore: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['load-more'])
const messageContainerRef = ref(null)

const showLoadMore = computed(
    () => props.hasMore || props.loadingMore
)

// Khi scroll lên đầu thì load thêm tin nhắn cũ
const handleScroll = () => {
    if (!messageContainerRef.value) {
        return
    }

    if (
        messageContainerRef.value.scrollTop <= 0 &&
        props.hasMore &&
        !props.loadingMore
    ) {
        emit('load-more')
    }
}

const scrollToBottom = () => {
    if (!messageContainerRef.value) {
        return
    }

    messageContainerRef.value.scrollTop =
        messageContainerRef.value.scrollHeight
}

const getScrollHeight = () => {
    return messageContainerRef.value?.scrollHeight || 0
}

const setScrollTop = (value) => {
    if (!messageContainerRef.value) {
        return
    }

    messageContainerRef.value.scrollTop = value
}

// Kiểm tra user có đang ở gần cuối không (trong khoảng 100px)
const isNearBottom = () => {
    if (!messageContainerRef.value) return true
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.value
    return scrollHeight - scrollTop - clientHeight <= 100
}

defineExpose({
    scrollToBottom,
    getScrollHeight,
    setScrollTop,
    isNearBottom,
})
</script>

<template>
    <div ref="messageContainerRef" class="message-list" @scroll="handleScroll">
        <div v-if="showLoadMore" class="message-loader">
            <el-tag v-if="loadingMore" type="info" effect="plain">
                Đang tải thêm tin nhắn...
            </el-tag>
        </div>

        <div v-if="messages.length" class="message-stack">
            <MessageBubble v-for="message in messages" :key="message.id" :message="message"
                :current-user-id="currentUserId" />
        </div>

        <el-empty v-else description="Chưa có tin nhắn" class="message-empty" />
    </div>
</template>

<style scoped lang="scss">
.message-list {
    height: 58vh;
    overflow-y: auto;
    padding: 18px 0;
}

.message-loader {
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
}

.message-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message-empty {
    height: 100%;
}

@media (max-width: 768px) {
    .message-list {
        height: 54vh;
    }
}
</style>
