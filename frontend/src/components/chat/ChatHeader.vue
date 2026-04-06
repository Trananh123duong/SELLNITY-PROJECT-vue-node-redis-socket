<script setup>
import { UserFilled } from '@element-plus/icons-vue'

defineProps({
    otherUser: {
        type: Object,
        default: () => null,
    },
})
</script>

<template>
    <div class="chat-header">
        <div class="user-info">
            <el-avatar :size="44">
                <el-icon>
                    <UserFilled />
                </el-icon>
            </el-avatar>

            <div class="user-meta">
                <h2>
                    {{ otherUser?.full_name || otherUser?.username || 'Cuộc trò chuyện' }}
                </h2>
                <span>Offline</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-header {
    padding-bottom: 18px;
    border-bottom: 1px solid #ebeef5;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-meta {
    h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #303133;
    }

    span {
        display: inline-block;
        margin-top: 4px;
        font-size: 13px;
        color: #909399;
    }
}
</style>
