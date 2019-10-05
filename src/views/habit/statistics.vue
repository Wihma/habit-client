<template>
  <v-container fluid class="container">
    <h1>{{this.habit.name}}</h1>
    <v-row>
      <v-col>
        <v-card class="stats" outlined tile>
          <ul>
            <li>Current Streak: {{currentStreak}}</li>
            <li>Longest streak: {{longestStreak}}</li>
            <li>Longest amount of time: {{longestTime}}</li>
            <li>Average time: {{avgTime}}s</li>
          <li>Longest streak: {{longestTime}}</li>
            <li>Days habit was completed: {{totalHabitPerformed}}</li>
          </ul>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="feed" outlined tile>
          <ul>
            <li>Pictures you took while doing the habit?</li>
            <li>Maybe latest notes you took while performin the habit?</li>
            <li>Recorded audio</li>
            <li>I.e. general media recorded during the habit</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="barchart" outlined tile>
          <ul>
            <li>Area Chart</li>
            <li>Y-axis is length habit was performed</li>
            <li>Can have shadowed unit number if that was selected</li>
            <li>X axis should be the last 30 days, but should be possible to scroll out</li>
          </ul>
          <svg class="chart" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  data: () => {
    return {
      habit: ''
    }
  },
  computed: {
    currentStreak () {
      return this.$store.getters.getCurrentStreak
    },
    longestStreak () {
      return this.$store.getters.getLongestStreak
    },
    longestTime () {
      return this.$store.getters.getLongestTime(this.habit._id)
    },
    avgTime () {
      return this.$store.getters.getAvgTime(this.habit._id, { to: '2019-09-04', from: new Date() })
    },
    totalHabitPerformed () {
      return this.$store.getters.getTotalHabitPerformed(this.habit._id)
    }
  },
  methods: {},
  beforeMount () {
    // check if habit exists
    let habit = this.$store.getters.getHabitById(this.$route.params.id)
    console.log({ message: 'getting habit', value: habit })
    if (!habit) {
      this.$router.push('/habits')
    }
    this.habit = habit
  }
}
</script>

<style scoped>
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

.barchart {
  width: 100%;
}
</style>
