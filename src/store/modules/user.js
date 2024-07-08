import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {getTagList} from "@/api";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    tagCategories: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TAG_CATEGORIES(state, categories) {
    state.tagCategories = categories
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {data} = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        //告诉 Promise 对象,当前的异步操作已经完成,并且执行成功。
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // tagList({commit}) {
  //   return new Promise((resolve, reject) => {
  //     getTagList().then(response => {
  //       const {data} = response
  //       //调用路由接口，后端返回相应用户的路由res.router，我们需要存储到store中，方便其他地方拿取
  //       this.$store.dispatch("tagList", data.list);
  //       commit('SET_TAG_LIST', data.list);
  //       resolve()
  //     })
  //   })
  // },
  fetchTagCategories({commit}) {
    return new Promise((resolve, reject) => {
      getTagList().then(response => {
        const {data} = response
        //调用路由接口，后端返回相应用户的路由res.router，我们需要存储到store中，方便其他地方拿取
        commit('SET_TAG_CATEGORIES', data)
        // commit('SET_TAG_CATEGORIES', data.list);
        resolve()
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {name, avatar} = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  }
  ,

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

