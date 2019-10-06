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
          <h2 class="pt-2 text-center">Habit past 30 days</h2>
          <svg class="chart" viewBox="0 0 1256 500" perserveAspectRatio="xMinYMid">></svg>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'

export default {
  components: {},
  data: () => {
    return {
      habit: ''
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
    initAreaGraph () {
      // 2. Use the margin convention practice
      // let daysPerformed = this.$store.getters.getAllPerformedDates(
      //   this.habit._id
      // )

      let daysPerformed = this.$store.getters.getAllPerformedDatesStub(
        this.habit._id
      )

      var data = []

      // for (
      //   let i = this.habit.daysPerformed.length - 30;
      //   i < this.habit.daysPerformed.length;
      //   i++
      // ) {
      //   data.push(this.habit.daysPerformed[i])
      // }

      // for (
      //   let i = daysPerformed.length - 30;
      //   i < daysPerformed.length;
      //   i++
      // ) {
      //   data.push(daysPerformed[i])
      // }

      let d = new Date()

      d.setMonth(d.getMonth() - 1)
      data = daysPerformed.filter((perf) => {
        return perf.time.start > d
      })

      var margin = { top: 50, right: 50, bottom: 50, left: 50 }
      var width = 1256 - margin.left - margin.right // Use the window's width
      var height = 500 - margin.top - margin.bottom // Use the window's height

      // 5. X scale will use the index of our data
      var xScale = d3
        .scaleTime()
        .domain([new Date(d), new Date()]) // input
        .range([0, width]) // output

      // var xScale = d3.scaleLinear()
      // .domain([0, n-1]) // input
      // .range([0, width]); // output

      // 6. Y scale will use the randomly generate number
      var yScale = d3
        .scaleLinear()
        .domain([0, 30]) // input
        .range([height, 0]) // output

      // 7. d3's line generator
      var line = d3
        .line()
        .x(function (d, i) {
          return xScale(i)
        }) // set the x values for the line generator
        .y(function (d) {
          return yScale(d.y)
        }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line

      // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
      var dataset = data

      function getDateDiffInMin (time) {
        return Math.round(
          Math.abs(
            new Date(time.start).getTime() - new Date(time.stop).getTime()
          ) / 1000 / 60
        )
      }

      console.log({ dataset })

      function getDate (dataPoint) {
        console.log(new Date(dataPoint.time.start))
        return new Date(dataPoint.time.start)
      }

      // 1. Add the SVG to the page and employ #2
      var svg = d3
        .select('.chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // 3. Call the x axis in a group tag
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale)) // Create an axis component with d3.axisBottom

      // 4. Call the y axis in a group tag
      svg
        .append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

      // 9. Append the path, bind the data, and call the line generator
      svg
        .append('path')
        .datum(dataset) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', line) // 11. Calls the line generator

      // 12. Appends a circle for each datapoint
      svg
        .selectAll('.dot')
        .data(dataset)
        .enter()
        .append('circle') // Uses the enter().append() method
        .attr('class', 'dot') // Assign a class for styling
        .attr('cx', function (d) {
          return xScale(getDate(d))
        })
        .attr('cy', function (d) {
          return yScale(getDateDiffInMin(d.time))
        })
        .attr('r', 5)
        .on('mouseover', function (a, b, c) {
          // a.attr('class', 'focus')
        })
        .on('mouseout', function () {})
    }
    //   initAreaGraph () {
    //     // let daysPerformed = this.$store.getters.getAllPerformedDates(this.habit._id)

    //     let width = 1256
    //     let height = 500
    //     let aspect = width / height
    //     let chart = d3.select('.chart')
    //     let y = d3.scaleLinear().range([height, 0])

    //     var data = []

    //     for (let i = (this.habit.daysPerformed.length - 30); i < this.habit.daysPerformed.length; i++) {
    //       let perf = this.habit.daysPerformed[i]
    //       data.push(Math.round(Math.abs(new Date(perf.time.start).getTime() - new Date(perf.time.stop).getTime()) / 1000))
    //       perf = null
    //     }

    //     d3.select(window).on('resize', function () {
    //       var targetWidth = chart.node().getBoundingClientRect().width
    //       chart.attr('width', targetWidth)
    //       chart.attr('height', targetWidth / aspect)
    //     })

    //     y.domain([
    //       0,
    //       d3.max(data, function (d) {
    //         return d
    //       })
    //     ])

    //     var barWidth = width / data.length

    //     var bar = chart
    //       .selectAll('g')
    //       .data(data)
    //       .enter()
    //       .append('g')
    //       .attr('transform', (d, i) => {
    //         return 'translate(' + i * barWidth + ',0)'
    //       })

    //     bar
    //       .append('rect')
    //       .attr('y', d => y(d))
    //       .attr('height', d => {
    //         return height - y(d)
    //       })
    //       .attr('width', barWidth - 5)

    //     bar
    //       .append('text')
    //       .attr('x', (barWidth - 5) / 2)
    //       .attr('y', d => y(d - 0.5))
    //       .attr('dy', '.75em')
    //       .text(d => d)
    //   }
  },
  mounted () {
    this.initAreaGraph()
  },
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

.barchart-container {
  width: 100%;
}

.stats ul {
  list-style-type: none;
  font-size: 2em;
}

.chart {
  /* background-color: whitesmoke; */
}
.chart >>> rect {
  fill: steelblue;
}

.chart >>> text {
  fill: black;
  font: 12px sans-serif;
  text-anchor: middle;
}

.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* aspect ratio */
  vertical-align: top;
  overflow: hidden;
}
</style>
