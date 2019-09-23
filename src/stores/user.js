// import { userService } from '@/services/user'
export const user = {
  state: {
    user: {
      userId: '',
      email: false,
      username: ''
    }
  },
  getters: {
    getUsername: (state) => {
      return state.user.username
    }
  },
  mutations: {
    setCurrentuserId: (state, userId) => {
      if (localStorage.getItem('userId') !== null && localStorage.getItem('userId') !== '' && localStorage.getItem('userId').length > 5) {
        state.user.userId = localStorage.getItem('userId')
      } else {
        state.user.userId = userId
      }
    },
    setEmail: (state, email) => {
      state.user.email = email
    },
    setUsername: (state, username) => {
      state.user.username = username
    }
  },
  actions: {
    setUsername ({ dispatch, commit }, username) {
      console.log({ 'message': 'settings username', username: username })
      commit('setUsername', username)
    }
  }
}
