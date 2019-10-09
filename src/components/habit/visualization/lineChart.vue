<template>
  <v-container>
    <graph-area-dateblock
      :height="400"
      :axis-min="0"
      :axis-max="100"
      :axis-reverse="false"
      :axis-format="'MM-dd'"
      :axis-interval="1000 * 60 * 60 * 24"
      :labels="labels"
      :values="values"
    >
      <note :text="'Habit History'"></note>
      <legends :names="names"></legends>
      <tooltip :names="names" :position="'right'"></tooltip>
      <guideline :tooltip-x="true" :tooltip-y="true"></guideline>
    </graph-area-dateblock>

    <!-- <v-row>
      <v-col cols="12" sm="1"></v-col>
      <v-col cols="12" sm="3" md="4">
        <v-menu
          v-model="menuFromDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="fromDate"
              label="To Date"
              prepend-icon="event"
              readonly
              v-on="on"
              :change="updateFromDate()"
            ></v-text-field>
          </template>
          <v-date-picker v-model="fromDate" @input="menuFromDate = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="2"></v-col>

      <v-col cols="12" sm="3" md="4">
        <v-menu
          v-model="menuToDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="toDate"
              label="To Date"
              prepend-icon="event"
              readonly
              v-on="on"
              :change="updateToDate()"
            ></v-text-field>
          </template>
          <v-date-picker v-model="toDate" @input="menuToDate = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="1"></v-col>
    </v-row>-->
  </v-container>
</template>
<script>
import Vue from 'vue'
import VueGraph from 'vue-graph'

Vue.use(VueGraph)
export default {
  props: {
    daysPerformed: Array,
    habitId: String
  },
  components: {},
  data: () => ({
    labels: [new Date('2018-07-07 00:00:00'), new Date('2018-07-08 00:00:00')],
    names: ['Time (min)', 'Amount'],
    values: [[10, 0, 5, 5], [40, 10, 10, 10]],
    fromDate: '',
    menuFromDate: false,
    toDate: '',
    menuToDate: false
  }),
  methods: {
    formatDate (date) {
      let formattedDate = ('0' + date.getDate()).slice(-2)
      let formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2)
      let formattedYear = date.getFullYear()

      // Combine and format date string
      return formattedYear + '-' + formattedMonth + '-' + formattedDate
    },
    updateFromDate () {
      // doesn't work
      this.labels[0] = new Date(this.formatDate(new Date(this.fromDate)))
    },
    updateToDate () {
      // doesn't work
      this.labels[1] = new Date(this.formatDate(new Date(this.toDate)))
    }
  },
  beforeMount () {
    // set default values for from and to date
    let fromDate = new Date()
    fromDate = fromDate.setMonth(fromDate.getMonth() - 1)
    this.fromDate = this.formatDate(new Date(fromDate))
    this.labels[0] = new Date(this.formatDate(new Date(fromDate)))

    let toDate = new Date()
    this.toDate = this.formatDate(new Date(toDate))
    this.labels[1] = new Date(this.formatDate(new Date(toDate)))

    // get data
    // console.log({ prop: this.daysPerformed.length })
  },
  created () {
    // array of date diffs
    let dataTime = []
    let dataAmount = []

    console.log({ values: this.values[0] })

    // let that = this.$store.getters.getAllPerformedDatesStub(this.habitId)
    // console.log(that)
    this.$store.getters.getAllPerformedDatesStub(this.habitId).forEach(perf => {
      dataTime.push(Math.round(Math.abs(perf.time.start - perf.time.stop) / 1000 / 60))
      dataAmount.push(perf.amount)
    })

    this.values[0] = dataTime
    this.values[1] = dataAmount

    console.log({ values: this.values[0] })
  }
}
</script>

<style scoped>
</style>
