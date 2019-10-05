import Api from '@/services/Api'

export const habitService = {
  getAll () {
    return Api().get('habit/all')
      .then(handleResponse)
      .then((habits) => {
        return habits
      })
  },
  getAllHabitsForUser (userId) {
    return Api().get('habit/getAllHabitsForUser', { params: { userId: userId } })
      .then(
        res => handleResponse(res)
        , err => handleError(err)
      )
      .then((habits) => {
        return habits
      })
  },
  performed (habitId, dayPerformed, statistics) {
    console.log({ servicemethod: 'performed', payload: { habitId: habitId, dayPerformed: dayPerformed, statistics: statistics } })
    return Api().post('habit/habitPerformed', { habitId: habitId, dayPerformed: dayPerformed, statistics: statistics })
      .then(handleResponse)
      .then((response) => {

      })
  },
  new (userId, habit) {
    return Api().post('habit/new', { userId: userId, habit: habit })
      .then(handleResponse)
      .then((habit) => {
        return habit
      })
  },
  update (habit) {
    return Api().put('habit/update', { habit: habit })
      .then(handleResponse)
      .then((habit) => {
        return habit
      })
  },
  delete (_id) {
    console.log('delete habitid: ' + _id)
    return Api().delete('habit/delete', { params: { _id: _id } })
      .then(handleResponse)
      .then((res) => {
        return null
      })
  }
}

function handleResponse (response) {
  const data = response.data
  if (!(response.status === 200 && response.statusText === 'OK')) {
    if (response.status === 401) {
      // auto logout if 401 response returned from api
      console.log('should log out')
      this.$store.dispatch('logout')
      location.reload(true)
    }
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }
  return data
}

function handleError (error) {
  if (error.hasOwnProperty('response')) {
    if (error.response.hasOwnProperty('status')) {
      if (error.response.status === 401) {
        // this.$store.dispatch('logout')
        // this.$router.push('/logout')
      }
    }
  }
}
