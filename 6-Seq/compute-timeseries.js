function createTimeSeries(timeSeriesArray) {
  const timeSeriesObj = {
  
    // ...

    groupByDate() {
      const groupedResult = {
        map: timeSeriesObj.groupByFormat('YYYY-MM-DD'),

        dates() {
          return _.keys(groupedResult.map)
        },

        sum(date) {
          return _.sumBy(groupedResult.map[date], 'price')
        }
      }

      return groupedResult
    },

    // ...

  }

  return timeSeriesObj
}

const timeSeries = createTimeSeries(transactions)
const groupedByDateSeries = timeSeries.groupByDate()

console.log(groupedByDateSeries.dates())
//=> ["2018-03-01", "2018-03-02"]

const firstDate = groupedByDateSeries.dates()[0]

console.log(groupedByDateSeries.sum(firstDate))
//=> 70.5

// ----------------------------------------------------

groupedByDateSeries.dates().map(function(date) {
  return {
    date: date,
    sum: groupedByDateSeries.sum(date)
  }
})
//=> [
//   { date: "2018-03-01", sum: 70.5 },
//   { date: "2018-03-02", sum: 122.25 }
// ]

// ----------------------------------------------------

const timeSeriesObj = {

  // ...

  groupByWeek() {
    const groupedByDate = timeSeriesObj.groupByDate()

    const groupedResult = {
      map: _.groupBy(groupedByDate.dates(), function(date) {
        return moment(date).format('YYYY-WW')
      }),

      weeks() {
        return _.keys(groupedResult.map)
      },

      sum(week) {
        const dates = groupedResult.map[week]

       return _.sumBy(dates, function(date) {
          return groupedByDate.sum(date)
        })
      },

      average(week) {
        const dates = groupedResult.map[week]
        const sum = groupedResult.sum(week)

        return sum / dates.length
      }
    }

    return groupedResult
  },

  // ...

}