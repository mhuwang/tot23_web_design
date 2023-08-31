import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  // 登录页
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // {
  //   path: 'index_register',
  //   component: () => import('@/views/login/index_register'),
  //   hidden: true
  // },

  // 404 页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 首页
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/summary',
  //   children: [
  //     {
  //       path: 'summary',
  //       name: '首页',
  //       component: () => import('@/views/summary/index'),
  //       meta: { title: '首页', icon: 'summary' }
  //     },
      
  //   ]
  // },
//注册

  
  // 我的文件
  {
    path: '/workload',
    component: Layout,
    redirect: '/workload/CronJobs',
    name: '我的文件',
    meta: { title: '我的文件', icon: 'workload' },
    children: [
      {
        path: 'cronjobs',
        name: 'Cron Jobs',
        component: () => import('@/views/workload/CronJobs/index'),
        meta: { title: '图片', icon: 'cron-jobs' }
      },
      // 图片详情
      {
        path: 'cronjob/:name',
        component: () => import('@/views/workload/CronJobs/details/index'),
        name: '图片详情',
        meta: { title: '图片详情', noCache: true, activeMenu: '/cronjobs' },
        hidden: true,
        props: true
      },
      {
        path: 'daemonsets',
        name: 'Daemon Sets',
        component: () => import('@/views/workload/DaemonSets/index'),
        meta: { title: '视频', icon: 'daemon-sets' }
      },
      // 视频详情
      {
        path: 'daemonset/:name',
        component: () => import('@/views/workload/DaemonSets/details/index'),
        name: '视频详情',
        meta: { title: '视频详情', noCache: true, activeMenu: '/daemonsets' },
        hidden: true,
        props: true
      },
      {
        path: 'deployments',
        name: 'Deployments',
        component: () => import('@/views/workload/Deployments/index'),
        meta: { title: '文档', icon: 'deployments' },
      },
      // 文档详情
      {
        path: 'deployment/:name',
        component: () => import('@/views/workload/Deployments/details/index'),
        name: '文档详情',
        meta: { title: '文档详情', noCache: true, activeMenu: '/deployments' },
        hidden: true,
        props: true
      },
      // 音频
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('@/views/workload/Jobs/index'),
        meta: { title: '音频', icon: 'jobs' }
      },
      // 音频详情
      {
        path: 'job/:name',
        component: () => import('@/views/workload/Jobs/details/index'),
        name: '音频详情',
        meta: { title: '音频详情', noCache: true, activeMenu: '/jobs' },
        hidden: true,
        props: true
      },
      // 其他
      {
        path: 'pods',
        name: 'Pods',
        component: () => import('@/views/workload/Pods/index'),
        meta: { title: '其他', icon: 'pods' }
      },
      // 其他详情
      {
        path: 'pods/:name',
        component: () => import('@/views/workload/Pods/details/index'),
        name: '其他详情',
        meta: { title: '其他详情', noCache: true, activeMenu: '/pods' },
        hidden: true

      },
     ]
  },

  // // 创建资源
  // {
  //   path: '/establish',
  //   component: Layout,
  //   redirect: '/establish',
  //   children: [{
  //     path: 'establish',
  //     name: '创建资源',
  //     component: () => import('@/views/establish/index'),
  //     meta: { title: '创建资源', icon: 'establish' }
  //   }]
  // },
  // 个人信息
  {
    path: '/information',
    component: Layout,
    redirect: '/information',
    children: [{
      path: 'information',
      name: '个人信息',
      component: () => import('@/views/information/index'),
      meta: { title: '个人信息', icon: 'information' }
    }]
  },

  // 关于
  {
    path: '/about',
    component: Layout,
    redirect: '/about',
    children: [{
      path: 'about',
      name: '关于',
      component: () => import('@/views/about/index'),
      meta: { title: '关于', icon: 'about' }
    }]
  },
 
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
