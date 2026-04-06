<script setup>
import { formatMessageTime } from '@/utils/date'
import { UserFilled } from '@element-plus/icons-vue'

const props = defineProps({
  conversation: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="conversation-item"
    type="button"
    @click="$emit('click', conversation)"
  >
    <el-avatar :size="48" class="conversation-avatar">
      <el-icon><UserFilled /></el-icon>
    </el-avatar>

    <div class="conversation-content">
      <div class="conversation-top">
        <h3 class="conversation-name">
          {{ conversation.otherUser?.full_name || conversation.otherUser?.username || 'Người dùng' }}
        </h3>

        <span class="conversation-time">
          {{ formatMessageTime(conversation.lastMessage?.createdAt || conversation.updatedAt) }}
        </span>
      </div>

      <div class="conversation-bottom">
        <p class="conversation-message">
          {{ conversation.lastMessage?.content || 'Chưa có tin nhắn' }}
        </p>

        <el-badge
          v-if="conversation.unreadCount > 0"
          :value="conversation.unreadCount"
          class="conversation-unread"
        />
      </div>
    </div>
  </button>
</template>

<style scoped lang="scss">
.conversation-item {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #c6e2ff;
    background: #f5f9ff;
  }
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.conversation-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.conversation-bottom {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.conversation-message {
  margin: 0;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-unread {
  flex-shrink: 0;
}
</style>
