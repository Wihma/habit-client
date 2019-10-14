// import Vue from 'vue'
// import Vuex from 'vuex'
// import { authService } from '@/services/Auth'
// import { router } from '@/routers/router'

export const layout = {
  state: {
    iconMenu: {
      active: false
    },
    device: {
      isMobile: false
    }
  },
  getters: {
    userIconMenuVisibility: (state) => {
      return state.iconMenu.active
    },
    isMobile: (state) => {
      return state.device.isMobile
    }
  },
  mutations: {
    userIconMenuVisibilityFalse: (state) => {
      state.iconMenu.active = false
    },
    userIiconMenuVisibilityTrue: (state) => {
      state.iconMenu.active = true
    },
    deviceIsMobile: (state, isMobile) => {
      state.device.isMobile = isMobile
    }
  },
  actions: {
    UserIconMenuVisibilityFalse ({ dispatch, commit }) {
      commit('userIconMenuVisibilityFalse')
    },
    UserIconMenuVisibilityTrue ({ dispatch, commit }) {
      commit('userIconMenuVisibilityTrue')
    },
    checkIfMobile ({ dispatch, commit }) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        commit('deviceIsMobile', true)
      } else {
        commit('deviceIsMobile', false)
      }
    }
  }
}
