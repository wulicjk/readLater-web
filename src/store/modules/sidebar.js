const state = {
  isEditMode: false,
  initStatus: false,
}

const mutations = {
  SET_EDIT_MODE: (state, value) => {
    state.isEditMode = value
  },
  INIT_ALL_TAG_STATUS: (state, value) => {
    state.initStatus = value
  }
}

const actions = {
  toggleEditMode({commit}) {
    commit('SET_EDIT_MODE', !state.isEditMode)
  },
  initAllTagStatus({commit}) {
    commit('INIT_ALL_TAG_STATUS', !state.initStatus)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
