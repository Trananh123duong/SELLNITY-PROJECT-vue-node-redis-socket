<script setup>
import { formatMessageTime } from '@/utils/date'
import { computed } from 'vue'

const props = defineProps({
    message: {
        type: Object,
        default: () => ({}),
    },
    currentUserId: {
        type: [Number, String],
        default: null,
    },
})

const isOwnMessage = computed(
    () => Number(props.message.sender?.id) === Number(props.currentUserId)
)
</script>

<template>
    <div class="message-row" :class="{
        'message-row--own': isOwnMessage,
    }">
        <div class="message-bubble" :class="{
            'message-bubble--own': isOwnMessage,
        }">
            <p class="message-content">
                {{ message.content }}
            </p>

            <span class="message-time">
                {{ formatMessageTime(message.createdAt || message.created_at) }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.message-row {
    display: flex;
    justify-content: flex-start;
}

.message-row--own {
    justify-content: flex-end;
}

.message-bubble {
    max-width: min(78%, 520px);
    background: #f4f4f5;
    border-radius: 16px;
    padding: 12px 14px;
}

.message-bubble--own {
    background: #409eff;

    .message-content,
    .message-time {
        color: #fff;
    }
}

.message-content {
    margin: 0;
    color: #303133;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
}

.message-time {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #909399;
    text-align: right;
}
</style>
