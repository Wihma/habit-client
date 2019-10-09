<template>
  <v-container fluid class="container">
    <h1>{{this.habit.name}}</h1>
    <v-row>
      <v-col>
        <v-card class="stats" outlined tile>
          <h2 class="pa-3">Stats</h2>
          <ul>
            <li>Current Streak: {{this.habit.statistics.currentStreak}}</li>
            <li>Longest streak: {{this.habit.statistics.longestStreak}}</li>
            <li>Longest amount of time: {{longestTime}}</li>
            <li>Average time: {{avgTime}}s</li>
            <li>Days habit was completed: {{totalHabitPerformed}}</li>
          </ul>
        </v-card>
      </v-col>
      <!-- <v-col>
        <v-card class="feed" outlined tile>
          <h2>Habit past 30 days</h2>
          <ul>
            <li>Pictures you took while doing the habit?</li>
            <li>Maybe latest notes you took while performin the habit?</li>
            <li>Recorded audio</li>
            <li>I.e. general media recorded during the habit</li>
          </ul>
        </v-card>
      </v-col>-->
    </v-row>
    <v-row>
      <v-col>
        <v-card class="barchart-container" outlined tile text->
          <!-- <ul>
            <li>Area Chart</li>
            <li>Y-axis is length habit was performed</li>
            <li>Can have shadowed unit number if that was selected</li>
            <li>X axis should be the last 30 days, but should be possible to scroll out</li>
          </ul>-->
          <!-- <h2 class="pt-2 text-center">Habit past 30 days</h2> -->
          <line-chart daysPerformed="daysPerformed" habitId="habit._id"></line-chart>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from '@/components/habit/visualization/lineChart.vue'

export default {
  components: {
    'line-chart': LineChart
  },
  data: () => {
    return {
      habit: '',
      daysPerformed: ''

    }
  },
  computed: {
    // currentStreak () {
    //   return this.$store.getters.getCurrentStreak(this.habit._id)
    // },
    // longestStreak () {
    //   return this.$store.getters.getLongestStreak(this.habit._id)
    // },
    longestTime () {
      return this.$store.getters.getLongestTime(this.habit._id)
    },
    avgTime () {
      return this.$store.getters.getAvgTime(this.habit._id, {
        to: '2019-09-04',
        from: new Date()
      })
    },
    totalHabitPerformed () {
      return this.$store.getters.getTotalHabitPerformed(this.habit._id)
    }
  },
  methods: {

  },
  mounted () {
  },
  beforeMount () {
    // check if habit exists
    let habit = this.$store.getters.getHabitById(this.$route.params.id)
    if (!habit) {
      this.$router.push('/habits')
    }
    this.habit = habit
  }
}
</script>

<style >
@media screen and (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media screen and (max-width: 1280px) {
  .container {
    max-width: 100%;
  }
}

@media screen and (max-width: 500px) {
  .container {
    max-width: 100%;
  }
  .stats {
    min-width: 340px;
  }
  .feed {
    min-width: 340px;
  }
}

.barchart-container {
  width: 100%;
}

.stats ul {
  list-style-type: none;
  font-size: 2em;
}

</style>
