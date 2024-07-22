const state = {
  isEditMode: false,
  initStatus: false,
  newSubMenuMode:false,
}

const mutations = {
  SET_EDIT_MODE: (state, value) => {
    state.isEditMode = value
  },
  INIT_ALL_TAG_STATUS: (state, value) => {
    state.initStatus = value
  },
  SET_NEW_SUB_MENU_MODE: (state, value) => {
    state.newSubMenuMode = value
  }
}

const actions = {
  toggleEditModeTrue({commit}) {
    commit('SET_EDIT_MODE', true)
  },
  toggleEditModeFalse({commit}) {
    commit('SET_EDIT_MODE', false)
  },
  initAllTagStatus({commit}) {
    commit('INIT_ALL_TAG_STATUS', !state.initStatus)
  },
  toggleNewSubMenuModeTrue({commit}){
    commit('SET_NEW_SUB_MENU_MODE', true)
  },
  toggleNewSubMenuModeFalse({commit}){
    commit('SET_NEW_SUB_MENU_MODE', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
