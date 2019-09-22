<template>
  <div class="habit-list">
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md4>
              <habit-list-item
                v-for="(habit, index) in this.todayHabits"
                :key="habit._id"
                :habit="habit"
                @completedHabit="completedHabit(index)"
              ></habit-list-item>
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
    todayHabits: '',
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
    completedHabit (index) {
      // console.log({ habitId: habitId })
      // console.log(typeof this.todayHabits)
      // console.log(this.todayHabits)

      // let index = this.todayHabits.findIndex((h) => {
      //   if (h._id === habitId) {
      //     console.log(h.name)
      //     return true
      //   }
      // })

      this.todayHabits.splice(index, 1)

      // console.log({ index: index, removed: this.todayHabits[index].name })
    }
  },
  watch: {

  },
  beforeMount () {
    let todayHabits = this.$store.getters.getTodaysHabits
    if (todayHabits !== undefined) {
      todayHabits.forEach((habit) => {
        todayHabits.visible = true
        todayHabits.show = false
      })

      this.todayHabits = todayHabits
      this.todayHabits.forEach(habit => {
        console.log(JSON.stringify(habit))
      })
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
