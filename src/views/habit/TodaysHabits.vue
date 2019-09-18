<template>
  <div class="habit-list">
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md4>
            <div
              v-for="habit in this.habits"
              :key="habit.key"
            >
              <habit-list-item
                :habit="habit"
                @completedHabit="completedHabit"
              ></habit-list-item>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    <v-btn
      id="createHabitButton"
      @click="newHabit"
      color="pink"
      dark
      absolute
      bottom
      right
      fab
    >
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>
<script>

import HabitListItem from '@/components/habit/today-habit-list-item'

export default {
  components: {
    'habit-list-item': HabitListItem
  },
  data: () => ({
    // habits data stubs
    habits: '',
    search: {
      text: ''
    }
  }),
  computed: {
    // habits () {
    //   // make sure all habits are visible when retrieved from the store
    //   let tempHabits = this.$store.getters.getTodaysHabits
    //   if (tempHabits !== undefined) {
    //     tempHabits.forEach((habit) => {
    //       habit.visible = true
    //       habit.show = false
    //     })

    //     return tempHabits
    //   } else {
    //     return []
    //   }
    //   // let tempHabits = this.$store.getters.getAllHabitsForUser;
    // }
  },
  methods: {
    newHabit () {
      // -1 equals new habit
      this.$router.push('habit/-1')
    },
    completedHabit (habitId) {
      this.habits.splice(this.habits.findIndex(h => {
        return h._id === habitId
      }, 1))
    }
  },
  watch: {

  },
  beforeMount () {
    let habits = this.$store.getters.getTodaysHabits
    if (habits !== undefined) {
      habits.forEach((habit) => {
        habits.visible = true
        habits.show = false
      })

      this.habits = habits
    }
  },
  mounted () {

  },
  beforeUpdate () {

  }
}
</script>

<style scoped>
#createHabitButton{
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
