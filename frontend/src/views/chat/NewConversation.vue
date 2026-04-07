<script setup>
import { useConversationStore } from '@/stores/conversation.store'
import { Search, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const conversationStore = useConversationStore()
const {
  candidateUsers: users,
  candidateUsersLoading: loading,
  creatingRoom,
} = storeToRefs(conversationStore)

const keyword = ref('')
const debounceTimer = ref(null)
const initialLoaded = ref(false)

const hasKeyword = computed(() => !!keyword.value.trim())

const fetchInitialUsers = async () => {
  try {
    await conversationStore.fetchInitialUsers()
    initialLoaded.value = true
  } catch (err) {
    ElMessage.error(
      err.response?.data?.message || 'Không thể tải danh sách người dùng'
    )
  }
}

const fetchUsers = async (searchKeyword) => {
  try {
    await conversationStore.searchUsers(searchKeyword)
  } catch (err) {
    ElMessage.error(
      err.response?.data?.message || 'Không thể tìm người dùng'
    )
  }
}

// Debounce để tránh gọi API liên tục khi người dùng đang gõ
watch(keyword, (newValue) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  if (!newValue.trim()) {
    fetchInitialUsers()
    return
  }

  debounceTimer.value = setTimeout(async () => {
    await fetchUsers(newValue)
  }, 300)
})

const handleCreateConversation = async (user) => {
  try {
    const conversationId =
      await conversationStore.createPrivateConversation(user.id)

    if (conversationId) {
      router.push(`/chat/${conversationId}`)
    }
  } catch (err) {
    ElMessage.error(
      err.response?.data?.message ||
      'Không thể tạo cuộc trò chuyện mới'
    )
  }
}

onBeforeUnmount(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

onMounted(async () => {
  await fetchInitialUsers()
})
</script>

<template>
    <div class="new-conversation-page">
        <div class="top-bar">
            <h2>Tạo cuộc trò chuyện mới</h2>
        </div>

        <el-input v-model="keyword" size="large" placeholder="Tìm theo username hoặc họ tên" clearable
            class="search-input">
            <template #prefix>
                <el-icon>
                    <Search />
                </el-icon>
            </template>
        </el-input>

        <div v-if="loading" class="loading-state">
            <el-skeleton :rows="3" animated />
            <el-skeleton :rows="3" animated />
        </div>

        <el-empty v-else-if="hasKeyword && !users.length" description="Không tìm thấy user phù hợp"
            class="empty-state" />

        <el-empty v-else-if="initialLoaded && !users.length" description="Hiện chưa có user để bắt đầu trò chuyện"
            class="empty-state" />

        <div v-else class="user-list">
            <button v-for="user in users" :key="user.id" type="button" class="user-item" :disabled="creatingRoom"
                @click="handleCreateConversation(user)">
                <div class="user-left">
                    <el-avatar :size="46">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                    </el-avatar>

                    <div class="user-meta">
                        <h3>{{ user.full_name }}</h3>
                        <span>@{{ user.username }}</span>
                    </div>
                </div>

                <el-button type="primary" plain size="small" :loading="creatingRoom">
                    Nhắn tin
                </el-button>
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.new-conversation-page {
    max-width: 820px;
    margin: 0 auto;
}

.top-bar {
    margin-bottom: 20px;

    h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        color: #303133;
    }
}

.search-input {
    margin-bottom: 20px;
}

.loading-state {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.empty-state {
    padding: 28px 0;
}

.user-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.user-item {
    width: 100%;
    border: 1px solid #ebeef5;
    border-radius: 12px;
    background: #fff;
    padding: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #c6e2ff;
        background: #f5f9ff;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
}

.user-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.user-meta {
    min-width: 0;

    h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    span {
        display: block;
        margin-top: 4px;
        color: #909399;
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .user-item {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
