import Vue from 'vue'
import Router from 'vue-router'
import Routers from './routers'

Vue.use(Router)

const router = new Router({
  routes: Routers,
  mode: 'hash',
  base: '/admin/'
})

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let userName = localStorage.getItem('userName');
  if (to.path === '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (userName) {
      next({path: '/'})
    } else {
      next()
    }
  } else if (to.path === '/register') {//注册页
    next()
  } else {
    if (!userName) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({path: '/login'})
    } else {
      // addDynamicMenuAndRoutes(userName, to, from);
      next();
    }
  }
})


/**
 * 加载动态菜单和路由
 */
// function addDynamicMenuAndRoutes(userName, to, from) {
//   if (store.state.app.menuRouteLoaded) {
//     console.log('动态菜单和路由已经存在.')
//     return
//   }
//   var type = 1;
//   if (to.path.startsWith('/app')) {
//     type = 2;
//   }
//   https.get('web/permission/list', {'roleId': sessionStorage.getItem('roleId'), 'type': type}).then(res => {
//     // 添加动态路由
//     let dynamicRoutes = addDynamicRoutes(res.data)
//     // 处理静态组件绑定路由
//     // router.addRoutes(router.options.routes)
//     var route = [{
//       path: '/',
//       component: Home,
//       children: dynamicRoutes
//     }];
//     router.addRoutes(route);
//     // 保存加载状态
//     store.commit('menuRouteLoaded', true)
//     // 保存菜单树
//     store.commit('setNavTree', res.data)
//   }).then(res => {
//     https.get('web/permission/list/' + userName).then(res => {
//       // 保存用户权限标识集合
//       store.commit('setPerms', res.data)
//     })
//   }).catch(function (res) {
//     // console.log(res)
//   })
// }
//
//
// /**
//  * 添加动态(菜单)路由
//  * @param {*} menuList 菜单列表
//  * @param {*} routes 递归创建的动态(菜单)路由
//  */
// function addDynamicRoutes(menuList = [], routes = []) {
//   var temp = []
//   for (var i = 0; i < menuList.length; i++) {
//     if (menuList[i].children && menuList[i].children.length >= 1) {
//       temp = temp.concat(menuList[i].children)
//     } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
//       menuList[i].url = menuList[i].url.replace(/^\//, '')
//       // 创建路由配置
//       var route = {
//         path: menuList[i].url,
//         component: null,
//         name: menuList[i].name,
//         meta: {
//           icon: menuList[i].icon,
//           id: menuList[i].id,
//           title: menuList[i].title,
//           type: menuList[i].type
//         }
//       }
//       try {
//         // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
//         // 如url="page/app"，则组件路径应是"@/views/page/app.vue",否则组件加载不到
//         let array = menuList[i].url.split('/')
//         let url = ''
//         for (let i = 0; i < array.length; i++) {
//           url += array[i].substring(0, 1) + array[i].substring(1) + '/'
//         }
//         url = url.substring(0, url.length - 1)
//         route['component'] = resolve => require([`@/views/${url}`], resolve)
//       } catch (e) {
//       }
//       routes.push(route)
//     }
//   }
//   if (temp.length >= 1) {
//     addDynamicRoutes(temp, routes)
//   } else {
//     // console.log('动态路由加载完成')
//   }
//   return routes
// }

export default router
