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
  <table border="1" cellpadding="10" cellspacing="0" width="100%">
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Full Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Active</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.full_name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.phone }}</td>
        <td>{{ user.is_active ? 'Yes' : 'No' }}</td>
        <td>
          <router-link :to="`/users/${user.id}/edit`">
            Edit
          </router-link>

          <button @click="$emit('delete', user.id)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>