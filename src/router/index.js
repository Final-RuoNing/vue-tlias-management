import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页（独立，不套Layout）
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    // 主布局（所有业务页面都套在Layout里）
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      children: [
        // 首页
        {
          path: '',
          name: 'home',
          component: () => import('@/views/index/index.vue')
        },
        // 部门管理
        {
          path: 'dept',
          name: 'dept',
          component: () => import('@/views/dept/index.vue')
        },
        // 员工管理
        {
          path: 'emp',
          name: 'emp',
          component: () => import('@/views/emp/index.vue')
        },
        // 用户管理
        {
          path: 'user/list',
          name: 'userList',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '用户列表' }
        },
        {
          path: 'user/role',
          name: 'userRole',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '角色管理' }
        },
        {
          path: 'user/perm',
          name: 'userPerm',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '权限管理' }
        },
        // 数据统计
        {
          path: 'data/emp',
          name: 'dataListEmp',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '员工信息统计' }
        },
        {
          path: 'data/students',
          name: 'dataListStudents',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '学员信息统计' }
        },
        // 设置
        {
          path: 'settings/base',
          name: 'settingsBase',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '基本设置' }
        },
        {
          path: 'settings/security',
          name: 'settingsSecurity',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '安全设置' }
        },
        {
          path: 'settings/notice',
          name: 'settingsNotice',
          component: () => import('@/views/PagePlaceholder.vue'),
          meta: { title: '通知设置' }
        }
      ]
    }
  ]
})

// 路由守卫：没登录不能访问其他页面
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') {
    next('/login')
  } else if (token && to.path === '/login') {
    next('/')
  } else {
    next()
  }
})

export default router
