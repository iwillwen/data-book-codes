const transactionsGroupedByDate = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY-MM-DD')
})

console.log(transactionsGroupedByDate)
// => {
//  "2018-03-01": [{...}, {...}],
//  "2018-03-02": [{...}, {...}]
// }

// ----------------------------------------------------

const transactionsGroupedByWeek = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY-WW')
})

console.log(transactionsGroupedByWeek)
// => {
//   "2018-09": [{…}, {…}, {…}, {…}, {…}, {…}]
// }

const transactionsGroupedByMonth = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY-MM')
})

// ----------------------------------------------------

console.log(transactionsGroupedByMonth)
// => {
//   "2018-03": [{…}, {…}, {…}, {…}, {…}, {…}]
// }

// ----------------------------------------------------

const transactionsGroupedByYear = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY')
})

console.log(transactionsGroupedByYear)
// => {
//   "2018": [{…}, {…}, {…}, {…}, {…}, {…}]
// }

// ----------------------------------------------------

function createTimeSeries(timeSeriesArray) {
  const timeSeriesObj = {
    array: timeSeriesArray.map(function(data) {
      data.moment = moment(data.timestamp)

      return data
    }),

    groupByFormat(formatPattern) {
      return _.groupBy(timeSeriesObj.array, function(data) {
        return data.moment.format(formatPattern)
      })
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
    }

    // ...

  }

  return timeSeriesObj
}

const timeSeries = createTimeSeries(transactions)
console.log(timeSeries.groupByMonth())