export default [
  {
    path: '/login',
    name: 'login',
    meta: {auth: false, title: '登录'},
    component: resolve => require(['@/components/page/Login'], resolve)
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/register',
    name: 'register',
    component: resolve => require(['@/components/page/403'], resolve)
  },
  {
    path: '/',
    component: resolve => require(['@/components/common/Home'], resolve),
    meta: {title: '自述文件'},
    children: [
      {
        path: '/dashboard',
        component: resolve => require(['@/components/page/Order'], resolve),
        meta: {title: '订单列表'}
      },
      {
        path: '/middleman',
        component: resolve => require(['@/components/page/Middleman'], resolve),
        meta: {title: '中间商列表'}
      },
      {
        path: '/tabs',
        component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
        meta: {title: 'tab选项卡'}
      },
      {
        path: '/userInfo',
        component: resolve => require(['@/components/page/UserInfo'], resolve),
        meta: {title: '账户信息'}
      },
      {
        //修改密码
        path: '/password',
        component: resolve => require(['@/components/page/Password'], resolve),
        meta: {title: '修改密码'}
      },
      {
        path: '/buyerList',
        component: resolve => require(['@/components/page/BuyerList'], resolve),
        meta: {title: '采购列表'}
      },
      {
        path: '/userList',
        component: resolve => require(['@/components/page/UserList'], resolve),
        meta: {title: '用户列表'}
      },
      {
        path: '/roleList',
        component: resolve => require(['@/components/page/RoleList'], resolve),
        meta: {title: '角色列表'}
      },
      {
        path: '/permList',
        component: resolve => require(['@/components/page/PermList'], resolve),
        meta: {title: '权限列表'}
      },
      {
        path: '/404',
        component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
        meta: {title: '404'}
      },
      {
        path: '/403',
        component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
        meta: {title: '403'}
      }
    ]
  }

]
