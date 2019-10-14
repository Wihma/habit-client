<script>
import Vue from 'vue'
import VueGraph from 'vue-graph'

Vue.use(VueGraph)
export default {
  props: {
    habitId: String
  },
  components: {},
  data: () => ({
    labels: [new Date('2018-07-07 00:00:00'), new Date('2018-07-08 00:00:00')],
    names: ['Time (min)', 'Amount'],
    values: [[], []],
    fromDate: '',
    menuFromDate: false,
    toDate: '',
    menuToDate: false,
    values2: [[10, 5, 5, 5], [40, 10, 10, 10], [30, 30, 30, 30]]
  }),
  render: function (createElement) {
    return createElement(
      'graph-area-dateblock',
      {
        props: {
          height: 400,
          'axis-min': 0,
          'axis-max': 100,
          'axis-reverse': false,
          'axis-format': 'MM-dd',
          'axis-interval': 1000 * 60 * 60 * 24,
          labels: this.labels,
          values: this.values
        },
        slot: 'note',
        text: 'test'
      },
      [
        createElement('note', {
          props: {
            text: 'test text headline'
          }
        }),
        createElement('legends', {
          props: {
            names: this.names
          }
        }),
        createElement('tooltip', {
          props: {
            names: this.names,
            position: "'right'"
          }
        }),
        createElement('guideline', {
          props: {
            'tooltip-x': true,
            'tooltip-y': true
          }
        })
      ]
    )
  },
  methods: {
    formatDate (date) {
      let formattedDate = ('0' + date.getDate()).slice(-2)
      let formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2)
      let formattedYear = date.getFullYear()

      // Combine and format date string
      return formattedYear + '-' + formattedMonth + '-' + formattedDate
    },
    updateFromDate () {
      // doesn't work. Needs fixing
      this.labels[0] = new Date(this.formatDate(new Date(this.fromDate)))
    },
    updateToDate () {
      // doesn't work. k
      this.labels[1] = new Date(this.formatDate(new Date(this.toDate)))
    },

    onClickBar: function () {
      console.log(arguments)
      alert('onClickBar')
    },
    onClickOutside: function () {
      console.log(arguments)
      alert('onClickOutside')
    },
    onClickInside: function () {
      console.log(arguments)
      alert('onClickInside')
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
  },
  created () {
    // array of date diffs
    let dataTime = []
    let dataAmount = []

    this.$store.getters.getAllPerformedDates(this.habitId).forEach(perf => {
      dataTime.push(
        Math.round(
          Math.abs(
            new Date(perf.time.start).getTime() -
              new Date(perf.time.stop).getTime()
          ) /
            1000 /
            60
        )
      )
      dataAmount.push(perf.amount)
    })

    this.values[0] = dataTime
    this.values[1] = dataAmount
  }
}
</script>

<style scoped>
</style>
