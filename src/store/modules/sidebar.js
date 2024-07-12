const state = {
  isEditMode: false
}

const mutations = {
  SET_EDIT_MODE: (state, value) => {
    state.isEditMode = value
  }
}

const actions = {
  toggleEditMode({ commit }) {
    commit('SET_EDIT_MODE', !state.isEditMode)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
