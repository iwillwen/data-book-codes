import * as moment from 'moment'
import { keys, sumBy, groupBy } from 'lodash'

export default function createTimeSeries(timeSeriesArray) {
  const timeSeriesObj = {
    array: timeSeriesArray.map(function(data) {
      data.moment = moment(data.timestamp)

      return data
    }),

    groupByFormat(formatPattern) {
      return groupBy(timeSeriesObj.array, data => {
        return data.moment.format(formatPattern)
      })
    },

    groupByWindow(format) {
      const groupedResult = {
        map: timeSeriesObj.groupByFormat(format),

        windows() {
          const windows = keys(groupedResult.map)
            .sort((windowA, windowB) => moment(windowA).valueOf() - moment(windowB).valueOf())
          
          windows.desc = windows.reverse()

          return windows
        },

        sumBy(window, prop, mapper = x => x) {
          return sumBy(groupedResult.map[window].map(mapper), prop)
        },
        
        averageBy(window, prop, length) {
          const dates = groupedResult.map[window]
          const sum = groupedResult.sumBy(window, prop)
  
          return sum / (length || dates.length)
        }
      }

      return groupedResult
    },

    groupByDate() {
      return timeSeriesObj.groupByWindow('YYYY-MM-DD')
    },

    groupByWeek() {
      return timeSeriesObj.groupByWindow('YYYY-WW')
    },

    groupByMonth() {
      return timeSeriesObj.groupByWindow('YYYY-MM')
    },

    groupByYear() {
      return timeSeriesObj.groupByWindow('YYYY')
    }

  }

  return timeSeriesObj
}