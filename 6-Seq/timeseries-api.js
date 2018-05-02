function createTimeSeries(timeSeriesArray) {
  const timeSeriesObj = {

    groupByFormat(formatPattern) {
      if (caches[formatPattern]) {
        return caches[formatPattern]
      }

      const result = _.groupBy(timeSeriesObj.array, function(data) {
        return data.moment.format(formatPattern)
      })

      caches[formatPattern] = result

      return result
    },

    // ...

    dates() {
      return timeSeriesObj.groupByDate().dates()
    },

    weeks() {
      return timeSeriesObj.groupByWeek().weeks()
    },

    months() {
      return timeSeriesObj.groupByMonth().months()
    },

    years() {
      return timeSeriesObj.groupByYear().years()
    },

    sum(unit, point) {
      switch (unit) {
        case 'date':
          return timeSeriesObj.groupByDate().sum(point)

        case 'week':
          return timeSeriesObj.groupByWeek().sum(point)

        case 'month':
          return timeSeriesObj.groupByMonth().sum(point)

        case 'year':
          return timeSeriesObj.groupByYear().sum(point)
      }
    },

    average(unit, point) {
      switch (unit) {
        case 'week':
          return timeSeriesObj.groupByWeek().average(point)

        case 'month':
          return timeSeriesObj.groupByMonth().average(point)

        case 'year':
          return timeSeriesObj.groupByYear().average(point)
      }
    }
  }

  return timeSeriesObj
}

const timeSeries = createTimeSeries(transactions)
console.log(timeSeries.sum('month', '2018-03')) //=> 192.75
console.log(timeSeries.average('month', '2018-03')) //=> 96.375