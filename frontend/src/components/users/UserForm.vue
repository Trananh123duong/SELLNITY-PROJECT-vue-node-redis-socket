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
  emit('submit', { ...form })
}
</script>

<template>
  <el-form
    :model="form"
    label-width="120px"
    class="user-form"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="Username">
      <el-input v-model="form.username" />
    </el-form-item>

    <el-form-item label="Full Name">
      <el-input v-model="form.full_name" />
    </el-form-item>

    <el-form-item label="Email">
      <el-input v-model="form.email" type="email" />
    </el-form-item>

    <el-form-item label="Password">
      <el-input
        v-model="form.password"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item label="Phone">
      <el-input v-model="form.phone" />
    </el-form-item>

    <el-form-item label="Status">
      <el-switch v-model="form.is_active" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        {{ submitText }}
      </el-button>

      <router-link to="/users">
        <el-button>Cancel</el-button>
      </router-link>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.user-form {
  padding-top: 8px;
}
</style>