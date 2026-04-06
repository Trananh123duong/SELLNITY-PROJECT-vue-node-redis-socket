<script setup>
import ConversationItem from '@/components/conversations/ConversationItem.vue'

defineProps({
  conversations: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['select'])
</script>

<template>
  <div class="conversation-list">
    <ConversationItem
      v-for="conversation in conversations"
      :key="conversation.conversationId"
      :conversation="conversation"
      @click="$emit('select', conversation)"
    />
  </div>
</template>

<style scoped lang="scss">
.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
