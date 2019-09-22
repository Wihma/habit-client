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
    todayHabits: '',
    search: {
      text: ''
    }
  }),
  computed: {

  },
  methods: {
    newHabit () {
      // -1 equals new habit
      this.$router.push('habit/-1')
    },
    completedHabit (index) {
      this.todayHabits.splice(index, 1)
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
