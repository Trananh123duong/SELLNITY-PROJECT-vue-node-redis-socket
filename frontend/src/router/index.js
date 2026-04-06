import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ChatDetail from '@/views/chat/ChatDetail.vue'
import NewConversation from '@/views/chat/NewConversation.vue'
import ConversationListView from '@/views/conversations/ConversationListView.vue'
import UserCreateView from '@/views/users/UserCreateView.vue'
import UserEditView from '@/views/users/UserEditView.vue'
import UserListView from '@/views/users/UserListView.vue'

import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'login',
          component: LoginView,
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView,
        },
      ],
    },
    {
      path: '/users',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'user-list',
          component: UserListView,
        },
        {
          path: 'create',
          name: 'user-create',
          component: UserCreateView,
        },
        {
          path: ':id/edit',
          name: 'user-edit',
          component: UserEditView,
        },
      ],
    },
    {
      path: '/conversations',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'conversation-list',
          component: ConversationListView,
        },
      ],
    },
    {
      path: '/chat',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'new',
          name: 'new-conversation',
          component: NewConversation,
        },
        {
          path: ':id',
          name: 'chat-detail',
          component: ChatDetail,
        },
      ],
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/users'
  }

  return true
})

export default router