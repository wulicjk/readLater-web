import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import sidebar from './modules/sidebar'
import request from "@/utils/request";
import router, {constantRoutes} from "@/router";
console.log("vuex init")
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    sidebar
  },
  getters
})

export default store

const loadDynamicRoutes = () => {
  //todo 静态保存下，不用每次都调用刷新
  console.log("动态加载router")
  return request({
    url: '/tag/getTagList',
    method: 'get',
  }).then(response => {
    response.data.list.forEach(route => {
      constantRoutes[2].children.push({
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
    constantRoutes[2].children.push({path: '*', redirect: '/404', hidden: true})
    store.dispatch('user/setTagCategories', constantRoutes[2].children)
    router.addRoutes(constantRoutes)
  })
    .catch(error => {
      console.error('Error fetching dynamic routes:', error)
    })
}
loadDynamicRoutes().then(r => {
  // resetRouter()
  console.log("tag加载完毕")
})
