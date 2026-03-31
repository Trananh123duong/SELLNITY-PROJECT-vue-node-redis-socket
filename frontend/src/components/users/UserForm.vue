<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      username: '',
      full_name: '',
      email: '',
      password: '',
      phone: '',
      is_active: true,
    }),
  },
  submitText: {
    type: String,
    default: 'Save',
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  username: '',
  full_name: '',
  email: '',
  password: '',
  phone: '',
  is_active: true,
})

watch(
  () => props.initialValues,
  (newValue) => {
    form.username = newValue?.username || ''
    form.full_name = newValue?.full_name || ''
    form.email = newValue?.email || ''
    form.password = newValue?.password || ''
    form.phone = newValue?.phone || ''
    form.is_active = newValue?.is_active ?? true
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', {
    username: form.username,
    full_name: form.full_name,
    email: form.email,
    password: form.password,
    phone: form.phone,
    is_active: form.is_active,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Username</label><br />
      <input v-model="form.username" type="text" />
    </div>

    <div>
      <label>Full Name</label><br />
      <input v-model="form.full_name" type="text" />
    </div>

    <div>
      <label>Email</label><br />
      <input v-model="form.email" type="email" />
    </div>

    <div>
      <label>Password</label><br />
      <input v-model="form.password" type="password" />
    </div>

    <div>
      <label>Phone</label><br />
      <input v-model="form.phone" type="text" />
    </div>

    <div>
      <label>
        <input v-model="form.is_active" type="checkbox" />
        Active
      </label>
    </div>

    <br />

    <button type="submit">
      {{ submitText }}
    </button>
  </form>
</template>