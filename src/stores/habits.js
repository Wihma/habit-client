import { habitService } from '@/services/habit'
import Vue from 'vue'

export const habits = {
  state: {
    newHabit: {
      selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
      time: '12:00',
      active: true,
      measureWUnit: false,
      measureTime: true
    },
    habits: [
    ]
  },
  getters: {
    allUserHabits: (state) => {
      if (Object.keys(state.habits).length > 0) {
        return state.habits.filter(habit => habit.active === true)
      } else {
        return []
      }
    },
    habitsExist: (state) => {
      if (state.habits.length > 0) {
        return true
      } else {
        return false
      }
    },
    allArchivedHabits: (state) => {
      if (state.habits.length > 0) {
        return state.habits.filter(habit => habit.active === false)
      }
    },
    getHabitById: (state) => (_id) => {
      // id -1 equals new habit
      if (_id === '-1') {
        // here is a good place to set default values
        // return a clone of newHabit

        let newHabit = JSON.stringify(state.newHabit)
        return JSON.parse(newHabit)
      } else {
        return state.habits.find(habit => habit._id === _id)
      }
    },
    // getLatestPerformedByHabitId: (state, getters) => (_id) => {
    //   let daysPerformed = getters.getHabitById(_id).daysPerformed
    //   return daysPerformed[daysPerformed.length - 1]
    // },
    // getHabitPerformedId: (state, id) => {
    //   return state.habitsPerformed.find(p => p.id === parseInt(id))
    // },
    // getHabitPerformedByHabitId: (state) => (id) => {
    //   return state.habitsPerformed.find(p => p.habitId === parseInt(id))
    // },
    getTodaysHabits: (state) => {
      // returns all habits due today in chronologically

      // this code is a bit convoluted hence I will overcomment
      // get all habits with a schedule of todays Date
      // filter only active habit
      // check if habit already has been performed today by:
      //  get only date part of new date
      //  find habitperformed for current habit
      //  check if any habitperf with current date and include that habit in todays habit
      // finish by sort

      let d = new Date()
      let n = d.getDay()

      let todaysHabits = state.habits
      if (todaysHabits.length < 1) {
        return
      }

      todaysHabits = todaysHabits.filter(
        habit => habit.selectedWeekdays.find(
          (weekday) => {
            return parseInt(weekday) === n
          }
        )
      )

      todaysHabits = todaysHabits.filter(habit => habit.active === true)
      todaysHabits = todaysHabits.filter((habit) => {
        let today = new Date().setHours(0, 0, 0, 0)
        let daysPerformed = habit.daysPerformed.sort(function (a, b) {
          return a.time.start < b.time.start
        })

        var latestDay = null
        if (daysPerformed.length > 1 && daysPerformed !== undefined) {
          latestDay = daysPerformed[daysPerformed.length - 1]
        } else {
          latestDay = daysPerformed[0]
        }
        if (latestDay) {
          if (new Date(latestDay.time.start).setHours(0, 0, 0, 0) === today) {
            return false
          } else {
            return true
          }
        } else {
          // if empty return true
          return true
        }
      })
      todaysHabits.sort(function (a, b) {
        return a.time > b.time
      })
      return todaysHabits
    },
    // Habit statistics
    getCurrentStreak: (state) => {
      return 10
    },
    getLongestStreak: (state) => {
      return 11
    },
    getLongestTime: (state, getters) => (_id) => {
      let longestTime = Math.max.apply(Math, getters.getHabitById(_id).daysPerformed.map((perf) => {
        return Math.abs(new Date(perf.time.start) - new Date(perf.time.stop))
      }))

      return Math.round((longestTime / 1000 / 60)) + 'min'
    },
    getAvgTime: (state, getters) => (_id, dayIntervall) => {
      // validate input data
      if (!_id) {
        return 'habit not found'
      }
      let to = new Date()
      let from = to.setMonth(to.getMonth - 1)
      if (typeof dayIntervall !== 'object') {
        dayIntervall = {
          from: from,
          to: to
        }
      } else if (!dayIntervall.hasOwnProperty('from')) {
        dayIntervall.from = from
      } else if (!dayIntervall.hasOwnProperty('to')) {
        dayIntervall.to = to
      }
      if (!dayIntervall) {
        dayIntervall = 30
      }

      let habit = getters.getHabitById(_id)// state.habits.find(h => h._id === _id)
      let totalTime = 0
      habit.daysPerformed.forEach(perf => {
        totalTime += Math.abs(new Date(perf.time.start).getTime() - new Date(perf.time.stop).getTime())
      })
      // avg time in nearest seconds
      return Math.round((totalTime / habit.daysPerformed.length) / 1000)
    },
    getTotalHabitPerformed: (state, getters) => (_id) => {
      return getters.getHabitById(_id).daysPerformed.length
    }
  },
  mutations: {
    // getAllHabits: (state, habits) => {
    //   state.habits = habits
    // },
    setAllHabitsForUser: (state, habits) => {
      state.habits = habits
    },
    saveHabit: (state, habit) => {
      // filter out the habit based on habit._id and replace the values that differ
      // save and ensure should be the same
      let habitIndex
      let allHabits = state.habits
      try {
        habitIndex = allHabits.findIndex(h => h._id === habit._id)
        if (habitIndex > -1) {
          allHabits.splice(habitIndex, 1)

          Vue.set(state, 'habits', habit)
        }
      } catch {
        Vue.set(state, 'habits', habit)
      }
    },
    saveTodayPerformed: (state, payload) => {
      let tmpHabitPerformed

      try {
        tmpHabitPerformed = state.habits.find(h => h._id === payload.habitId)
        tmpHabitPerformed.daysPerformed.push(payload.dayPerformed)
      } catch {
        tmpHabitPerformed = {
          id: 0,
          habitId: payload.habitId,
          days: []
        }
        tmpHabitPerformed.days.push(payload.dayPerformed)
      }
    },
    refreshTodaysHabits: (state) => {
      let tmpHabits = state.habits
      state.habits = null
      state.habits = tmpHabits
    },
    deleteHabit: (state, habitId) => {
      // find index of deleted habit and remove it
      state.habits.splice(state.habits.findIndex((habit) => {
        return habit._id === habitId
      }), 1)
    },
    increaseStreak: (state, habitId) => {
      let habit = state.habits.find(h => h._id === habitId)
      if (!habit.hasOwnProperty('statistics')) {
        habit.statistics = {}
        habit.statistics.currentStreak = 1
        habit.statistics.longestStreak = 1
      } else {
        habit.statistics.currentStreak++
      }

      if (!habit.statistics.hasOwnProperty('longestStreak') || habit.currentStreak >= habit.longestStreak) {
        habit.statistics.longestStreak = habit.currentStreak
      }
    },
    resetStreak: (state, habitId) => {
      let habit = state.habits.find(h => h._id === habitId)
      habit.statistics.currentStreak = 1
    }
  },
  actions: {
    // make request to api for permanent storage and then trigger mutations
    getAllHabits ({ dispatch, commit }) {
      return habitService.getAll()
        .then((habits) => {
          commit('setAllHabits', habits)
        })
    },
    getAllHabitsForUser ({ dispatch, commit, rootState, rootGetters }) {
      return habitService.getAllHabitsForUser(rootGetters.currentUserId)
        .then((habits) => {
          commit('setAllHabitsForUser', habits)
        })
    },
    newHabit ({ dispatch, commit, rootState, rootGetters }, { habit }) {
      return habitService.new(rootGetters.currentUserId, habit)
        .then(
          commit('saveHabit', { habit: habit })
        )
    },
    updateHabit ({ dispatch, commit }, { habit }) {
      // should I wait for the server to update? It will reduce the responsiveness of the app.
      return habitService.update(habit)
        .then(
          commit('saveHabit', { habit: habit })
        )
    },
    saveTodayPerformed ({ dispatch, commit, state }, { habitId, dayPerformed }) {
      return new Promise((resolve, reject) => {
        let habit = state.habits.find(h => h._id === habitId)

        let daysPerformed = habit.daysPerformed

        if (daysPerformed.length > 0) {
          let latestPerformedDate = new Date(daysPerformed[daysPerformed.length - 1].time.stop)

          let dayPerformedDate = new Date(dayPerformed.time.start)

          if (latestPerformedDate.getFullYear() === dayPerformedDate.getFullYear() ||
            latestPerformedDate.getMonth() === dayPerformedDate.getMonthYear() ||
            latestPerformedDate.getDay() === (dayPerformedDate.getMonthDay() - 1)) {
            commit('increaseStreak', habitId)
          } else {
            commit('resetStreak', habitId)
          }
        } else {
          commit('increaseStreak', habitId)
        }
        console.log({ statistics: habit.statistics })
        habitService.performed(habitId, dayPerformed, habit.statistics)
          .then(
            (data) => {
              commit('saveTodayPerformed', { habitId: habitId, dayPerformed: dayPerformed })
              resolve(data)
            },
            (err) => {
              reject(err)
            }
          )
      })
    },
    deleteHabit ({ dispatch, commit }, { _id }) {
      return habitService.delete(_id)
        .then(
          commit('deleteHabit', { _id })
        )
    }
  }
}
