<template>
  <div class="habit-list">
    <v-container fluid fill-height>
      <v-layout justify-center>
        <v-flex xs12 sm8 md4>
          <v-row>
            <v-col class="test" v-if="!isMobile" cols="2"></v-col>
            <v-col cols="10">
              <v-app-bar xs12 sm8 md4 dense floating flat class="searchBar" justify-center>
                <v-text-field
                  v-model.lazy="search.text"
                  hide-details
                  single-line
                  autofocus
                  right
                  class="searchInput"
                  solo
                ></v-text-field>
                <v-btn icon>
                  <v-icon size="40">search</v-icon>
                </v-btn>
              </v-app-bar>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <div class="pa-2"></div>
          <v-col cols="12">
            <div v-for="habit in habits" :key="habit._id">
              <habit-list-item   :habit="habit"></habit-list-item>
              <v-divider v-if="habit.visible" class="mb-3"></v-divider>
            </div>
          </v-col>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn id="createHabitButton" @click="newHabit" color="pink" dark absolute bottom right fab>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>
<script>
import HabitListItem from '@/components/habit/habit-list-item'
export default {
  components: {
    'habit-list-item': HabitListItem
  },
  data: () => ({
    // habits data stubs
    search: {
      text: ''
    }
  }),
  computed: {
    habits () {
      // make sure all habits are visible when retrieved from the store
      let tempHabits = this.$store.getters.allUserHabits
      if (tempHabits.length > 0) {
        tempHabits.forEach(habit => {
          habit.visible = true
          habit.show = false
        })
        return tempHabits
      } else {
        return []
      }
    },
    habitsExist () {
      return this.$store.getters.habitsExist
    },
    isMobile () {
      return this.$store.getters.isMobile
    }
  },
  methods: {
    newHabit () {
      // -1 equals new habit
      this.$router.push('habit/-1')
    }
  },
  beforeMount () {
    this.$store.dispatch('getAllHabitsForUser')
  },
  watch: {
    search: {
      handler: function (search, oldSearch) {
        this.habits.forEach(habit => {
          if (
            habit.name.toLowerCase().indexOf(search.text.toLowerCase()) > -1
          ) {
            habit.visible = true
          } else {
            habit.visible = false
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#createHabitButton {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
@media (max-width: 360px) {
  .searchBar {
    width: 340px;
  }
  .searchInput {
    max-width: 280px;
    min-width: 260px;
  }
}
@media (min-width: 1280px) {
  .searchBar {
    width: 340px;
  }
  .searchInput {
    min-width: 400px;
  }
}
</style>
