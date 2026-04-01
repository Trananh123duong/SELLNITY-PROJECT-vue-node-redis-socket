<script setup>
defineProps({
  users: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['delete'])
</script>

<template>
  <el-table
    :data="users"
    stripe
    border
    style="width: 100%"
    class="user-table"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="username" label="Username" />
    <el-table-column prop="full_name" label="Full Name" />
    <el-table-column prop="email" label="Email" />
    <el-table-column prop="phone" label="Phone" />

    <el-table-column label="Active" width="100">
      <template #default="{ row }">
        <el-tag :type="row.is_active ? 'success' : 'danger'">
          {{ row.is_active ? 'Yes' : 'No' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="Action" width="180">
      <template #default="{ row }">
        <router-link :to="`/users/${row.id}/edit`">
          <el-button type="primary" size="small">
            Edit
          </el-button>
        </router-link>

        <el-button
          type="danger"
          size="small"
          @click="$emit('delete', row.id)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.user-table {
  border-radius: 12px;
  overflow: hidden;
}
</style>