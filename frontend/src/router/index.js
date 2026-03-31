import MainLayout from '@/layouts/MainLayout.vue'
import UserCreateView from '@/views/users/UserCreateView.vue'
import UserEditView from '@/views/users/UserEditView.vue'
import UserListView from '@/views/users/UserListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'users',
          name: 'user-list',
          component: UserListView,
        },
        {
          path: 'users/create',
          name: 'user-create',
          component: UserCreateView,
        },
        {
          path: 'users/:id/edit',
          name: 'user-edit',
          component: UserEditView,
        },
      ],
    },
  ],
})

export default router
