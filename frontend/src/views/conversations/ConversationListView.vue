<script setup>
import ConversationList from '@/components/conversations/ConversationList.vue'
import { getConversationsApi } from '@/api/conversation.api'
import { Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const conversations = ref([])
const loading = ref(false)
const error = ref('')

// Lấy danh sách conversation khi vào màn hình
const fetchConversations = async () => {
    loading.value = true
    error.value = ''

    try {
        const response = await getConversationsApi()
        const responseData = response.data.data || []

        conversations.value = [...responseData].sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        )
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'Không thể tải danh sách cuộc trò chuyện'
    } finally {
        loading.value = false
    }
}

const goCreateConversation = () => {
    router.push('/chat/new')
}

const handleSelectConversation = (conversation) => {
    router.push(`/chat/${conversation.conversationId}`)
}

const handleRetry = async () => {
    await fetchConversations()
}

onMounted(async () => {
    await fetchConversations()
})
</script>

<template>
    <div class="conversation-page">
        <div class="top-bar">
            <h2>Tin nhắn</h2>

            <el-button type="primary" @click="goCreateConversation">
                <el-icon>
                    <Plus />
                </el-icon>
                Tạo cuộc trò chuyện mới
            </el-button>
        </div>

        <el-alert v-if="error" type="error" :closable="false" show-icon class="error-state" :title="error">
            <template #default>
                <el-button type="danger" plain size="small" @click="handleRetry">
                    Thử lại
                </el-button>
            </template>
        </el-alert>

        <div v-if="loading" class="loading-list">
            <el-skeleton :rows="3" animated />
            <el-skeleton :rows="3" animated />
            <el-skeleton :rows="3" animated />
        </div>

        <el-empty v-else-if="!conversations.length && !error" description="Bạn chưa có cuộc trò chuyện nào"
            class="empty-state">
            <el-button type="primary" @click="goCreateConversation">
                Bắt đầu trò chuyện
            </el-button>
        </el-empty>

        <ConversationList v-else-if="!error" :conversations="conversations" @select="handleSelectConversation" />

        <el-empty v-else description="Không thể hiển thị dữ liệu lúc này" class="error-empty-state">
            <el-button type="primary" plain @click="handleRetry">
                Tải lại
            </el-button>
        </el-empty>

        <el-button class="floating-create" circle type="primary" @click="goCreateConversation">
            <el-icon>
                <Plus />
            </el-icon>
        </el-button>
    </div>
</template>

<style scoped lang="scss">
.conversation-page {
    position: relative;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        font-size: 22px;
        font-weight: 600;
        margin: 0;
        color: #303133;
    }
}

.loading-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.error-state {
    margin-bottom: 16px;
}

.empty-state,
.error-empty-state {
    padding: 28px 0;
}

.floating-create {
    position: fixed;
    right: 32px;
    bottom: 28px;
}

@media (max-width: 768px) {
    .top-bar {
        gap: 10px;
        flex-wrap: wrap;
    }

    .floating-create {
        right: 18px;
        bottom: 18px;
    }
}
</style>
