<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
    <div class="chat-detail-page">
        <el-card shadow="hover" class="chat-card">
            <h2>Chat #{{ route.params.id }}</h2>
            <p>Trang chi tiết cuộc trò chuyện sẽ được triển khai ở bước tiếp theo.</p>
        </el-card>
    </div>
</template>

<style scoped lang="scss">
.chat-detail-page {
    max-width: 880px;
    margin: 0 auto;
}

.chat-card {
    border-radius: 16px;

    h2 {
        margin: 0 0 10px 0;
        font-size: 24px;
        color: #303133;
    }

    p {
        margin: 0;
        color: #606266;
    }
}
</style>
