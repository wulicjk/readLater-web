import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {genuineRoutes, resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    categories: [],
    tagCategories: [],
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
  SET_CATEGORIES(state, categories) {
    state.categories = categories
    state.tagCategories = state.categories[3].children
  },
  ADD_ROUTES: (state, routes) => {
    state.tagCategories.pop();
    state.tagCategories.push(routes)
    state.tagCategories.push({path: '*', redirect: '/404', hidden: true})
  },
  DELETE_ROUTES: (state, tagIdToDelete) => {
    let indexToDelete = state.tagCategories.findIndex(tag => tag.id === tagIdToDelete);
    if (indexToDelete !== -1) {
      state.tagCategories.splice(indexToDelete, 1);
    }
  },
  UPDATE_ROUTES: (state, menu) => {
    let targetIndex = state.tagCategories.findIndex(item => item.id === menu.id);
    if (targetIndex !== -1) {
      state.tagCategories[targetIndex] = menu
    }
    console.log(state.tagCategories)
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

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {data} = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const {name, avatar} = data

        commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        //暂时固定用户头像
        commit('SET_AVATAR', require('@/assets/logo/avator.jpg'))
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
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  setCategories({commit}, categories) {
    commit('SET_CATEGORIES', categories)
  },
  addRoutes({commit}, menu) {
    commit('ADD_ROUTES', menu)
  },
  deleteRoutes({commit}, tagIdToDelete) {
    commit('DELETE_ROUTES', tagIdToDelete)
  },
  updateRoutes({commit}, menu) {
    commit('UPDATE_ROUTES', menu)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

