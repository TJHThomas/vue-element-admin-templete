import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    // redirect: '/dashboard',
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    //   }
    // ]
  },
  {
    path: '/changePwd',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/login/change-pwd'),
        name: 'ChangePwd',
        meta: {title: '修改密码'}
      }
    ]
  },
  {
    path: '/case',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/case/index'),
        name: 'Case',
        meta: {title: '案例管理', icon: 'example'}
      }, {
        path: 'createOrEdit/:id',
        hidden: true,
        component: () => import('@/views/case/createOrEdit'),
        name: 'CaseCreateOrEdit',
        meta: {title: '案例操作'}
      }
    ]
  }
]

export const asyncRoutes = [
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
