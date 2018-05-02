function createTimeSeries(timeSeriesArray) {
  const timeSeriesObj = {
    array: timeSeriesArray.map(function(data) {
      data.moment = moment(data.timestamp)

      return data
    }),

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

    groupByDate() {
      return timeSeriesObj.groupByFormat('YYYY-MM-DD')
    },

    groupByWeek() {
      return timeSeriesObj.groupByFormat('YYYY-WW')
    },

    groupByMonth() {
      return timeSeriesObj.groupByFormat('YYYY-MM')
    },

    groupByYear() {
      return timeSeriesObj.groupByFormat('YYYY')
    },

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