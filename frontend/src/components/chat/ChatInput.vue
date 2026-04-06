<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    sending: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue', 'send'])

const handleInput = (value) => {
    emit('update:modelValue', value)
}

const handleKeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        emit('send')
    }
}
</script>

<template>
    <div class="chat-input">
        <el-input :model-value="props.modelValue" type="textarea" :rows="2" resize="none" placeholder="Nhập tin nhắn..."
            @update:model-value="handleInput" @keydown="handleKeydown" />

        <div class="chat-input-actions">
            <el-button type="primary" :loading="sending" @click="$emit('send')">
                Gửi
            </el-button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-input {
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
}

.chat-input-actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}
</style>
