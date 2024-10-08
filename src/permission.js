import router, {constantRoutes, genuineRoutes} from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import request from "@/utils/request"
import _ from 'lodash';
import {cloneDeep} from "lodash/lang";
import Vue from "vue";
import Layout from "@/layout/index.vue";

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        //已经能获取到信息
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          //获取菜单
          if (store.state.user.categories.length === 0) {
            await loadDynamicRoutes().then(r => {
              console.log("tag加载完毕")
            })
          }
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({...to, replace: true})
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

const loadDynamicRoutes = () => {
  //todo 静态保存下，不用每次都调用刷新
  return request({
    url: '/tag/getTagList',
    method: 'get',
  }).then(async response => {
    response.data.list.forEach(route => {
      genuineRoutes[3].children.push({
        path: "/tag/" + route.tagName,
        name: "tag" + route.ID,
        id: route.ID,
        tagName: route.tagName,
        component: () => import(`@/views/tag/index`),
        meta: {
          title: route.tagName,
          // icon: 'dashboard'
        }
      })
    })
    genuineRoutes[3].children.push({path: '*', redirect: '/404', hidden: true})
    await store.dispatch('user/setCategories', genuineRoutes)
    await router.addRoutes(genuineRoutes)
  })
    .catch(error => {
      console.error('Error fetching dynamic routes:', error)
    })
}
