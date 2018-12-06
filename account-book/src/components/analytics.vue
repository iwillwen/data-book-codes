<template>
  <Card title="月度财务分析" :padding="0">
    <div style="padding: 15px 25px">
      <Row>
        <Col span="6" class="digi">
          <span class="digi-label">平均支出</span>
          <span class="digi-content">
            ¥{{ typedAverageAmount(selectedMonth, 0).toFixed(1) }}
            <span class="small">{{ delta(typedAverageAmount(selectedMonth, 0), typedAverageAmount(lastMonth, 0, true)) }}</span>
          </span>
        </Col>
        <Col span="6" class="digi">
          <span class="digi-label">上一个月平均支出</span>
          <span class="digi-content">¥{{ typedAverageAmount(lastMonth, 0, true).toFixed(1) }}</span>
        </Col>
        <Col span="6" class="digi">
          <span class="digi-label">平均收入</span>
          <span class="digi-content">
            ¥{{ typedAverageAmount(selectedMonth, 1).toFixed(1) }}
            <span class="small">{{ delta(typedAverageAmount(selectedMonth, 1), typedAverageAmount(lastMonth, 1, true)) }}</span>
          </span>
        </Col>
        <Col span="6" class="digi">
          <span class="digi-label">上一个月平均收入</span>
          <span class="digi-content">¥{{ typedAverageAmount(lastMonth, 1, true).toFixed(1) }}</span>
        </Col>
      </Row>
    </div>

    <Divider orientation="left">每日支出</Divider>
    <v-chart :options="dailyExpenseChartOption" :auto-resize="true" />

    <div v-if="typedMonthlyBills(selectedMonth, 0).length > 0">
      <Divider orientation="left">分类分析</Divider>
      <Row style="padding: 0px 20px">
        <Col span="12">
          <v-chart :options="typedCategoriesPieOption(0, selectedMonth)" :auto-resize="true" />
        </Col>
        <Col span="12">
          <v-chart :options="typedCategoriesPieOption(1, selectedMonth)" :auto-resize="true" />
        </Col>
      </Row>
      <Divider orientation="left">支出排行榜</Divider>
      <div id="categories-top-board">
        <Row
          class="category"
          :gutter="15"
          v-for="params in expenseCategoriesSummary"
          :key="params.category._key"
        >
          <Col span="2">
            {{ params.category.name }}
            <Icon
              type="md-arrow-round-up"
              color="#ed4014"
              v-if="params.direct === 1"
              size="16px"
            />
            <Icon
              type="md-arrow-round-down"
              color="#19be6b"
              v-if="params.direct === -1"
              size="16px"
            />
          </Col>
          <Col span="22">
            <Progress
              :percent="params.amount / mostExpensiveCategorySummary.amount * 100"
              status="normal"
              :stroke-width="25"
              hide-info
            />
          </Col>
        </Row>
      </div>
    </div>
  </Card>
</template>

<script>
import Bill from '../stores/bills'
import Category from '../stores/categories'
import createTimeSeries from '../utils/timeserie'
import * as moment from 'moment'
import { fromPairs } from 'lodash'
import ECharts from 'vue-echarts'

import 'echarts'

export default {
  name: 'analytics',

  props: [ 'selectedMonth' ],

  components: {
    'v-chart': ECharts
  },

  data() {
    return {
      bills: [],
      categories: []
    }
  },

  async mounted() {
    await this.loadBills()
    Bill.events
      .on('instance-added', bill => this.bills.push(bill.getCacheData()))
      .on('instance-updated', (key, field, value) => {
        const bill = this.bills.find(bill => bill._key === key)
        bill[field] = value
      })
      .on('instance-removed', key => {
        const index = this.bills.findIndex(bill => bill._key === key)
        this.bills.splice(index, 1)
      })

    await this.loadCategories()
    Category.events
      .on('instance-added', () => this.loadCategories())
      .on('instance-updated', () => this.loadCategories())
      .on('instance-removed', () => this.loadCategories())
  },

  computed: {

    lastMonth() {
      return moment(this.selectedMonth, 'YYYY-MM').subtract(1, 'month').format('YYYY-MM')
    },

    dates() {
      return Array(moment(this.selectedMonth, 'YYYY-MM').daysInMonth()).fill(1)
        .map((_, i) => `${this.selectedMonth}-${(i + 1).toString().padStart(2, '0')}`)
    },

    dailyExpenseChartOption() {

      const datesData = this.typedDatesData(this.selectedMonth, 0)

      return {
        dataset: {
          source: this.dates.map(date => ({
            date, expense: this.typedDailyAmount(this.selectedMonth, 0)[date] || 0
          }))
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const param = params[0]
            const date = param.data.date

            const dailyAmount = this.typedDailyAmount(this.selectedMonth, 0)

            const top3Bills = (datesData.map[date] || [])
              .sort(({ amount: amountA }, { amount: amountB }) => {
                return amountB - amountA
              })
              .slice(0, 3)

            const bills = top3Bills.length > 0
              ? top3Bills
                .map(bill => `
                  <span>
                    ${bill.label}
                    <span style="float: right">${bill.amount}</span>
                  </span>
                `).join('<br />')
              : `
                <div style="text-align: center">没有费用</div>
              `

            const sum = top3Bills.length <= 0 
              ? ''
              : `
                <div class="tooltip-sum">
                  <span>总计<span style="float: right">${dailyAmount[date]}</span></span>
                </div>
              `

            return `
              <div class="chart-tooltip">
                <div class="tooltip-title">${date}</div>
                <div class="tooltip-bills">
                  ${bills}
                </div>
                ${sum}
              </div>
            `
          },
          extraCssText: 'width: 150px; padding: 0;'
        },
        grid: {
          top: '5%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        xAxis: { type: 'category' },
        yAxis: {
          min: 0,
          max: value => value.max
        },
        series: [
          {
            type: 'line',
            encode: {
              x: 'date',
              y: 'expense'
            }
          }
        ]
      }
    },

    expenseCategoriesSummary() {
      const lastMonthSummary = this.typedCategoriesSummary(0, this.lastMonth)

      return this.typedCategoriesSummary(0, this.selectedMonth)
        .map(({ category, amount }) => {
          const lastMonth = lastMonthSummary.find(({ category: _category }) => category._key === _category._key)

          let direct = 0

          if (lastMonth) {
            direct = Math.sign(amount - lastMonth.amount)
          }

          return {
            category, amount, direct
          }
        })
    },

    mostExpensiveCategorySummary() {
      if (this.expenseCategoriesSummary.length > 0) {
        return this.expenseCategoriesSummary[0]
      }

      return null
    }

  },

  methods: {

    async loadBills() {
      this.bills = await Bill.dump()
    },

    async loadCategories() {
      this.categories = await Category.dump()
    },

    typedBills(type = 0) {
      return this.bills.filter(bill => bill.type === type)
    },

    typedRangeData(type = 0) {
      return createTimeSeries(this.typedBills(type)).groupByMonth()
    },

    typedMonthlyBills(month, type = 0) {
      return this.typedRangeData(type).map[month] || []
    },

    typedDatesData(month, type = 0) {
      return createTimeSeries(this.typedMonthlyBills(month, type)).groupByDate()
    },

    typedDailyAmount(month, type = 0) {
      const datesData = this.typedDatesData(month, type)

      return fromPairs(
        datesData.windows()
          .map(date => [ date, datesData.sumBy(date, 'amount') ])
      )
    },

    typedAverageAmount(month, type = 0, full = false) {
      const rangeData = this.typedRangeData(type)

      if (!rangeData.windows().includes(month)) {
        return 0
      }

      return rangeData.averageBy(month, 'amount', full ? moment(month, 'YYYY-MM').daysInMonth() : null)
    },

    delta(a, b) {
      let sign = ''
      switch (Math.sign(a - b)) {
        case -1:
          sign = '-'
          break

        case 1:
          sign = '+'
      }

      return sign + Math.abs((a - b) / (b || 1) * 100).toFixed(2) + '%'
    },

    typedCategoriesSummary(type, month) {
      const rangeData = this.typedRangeData(type)

      if (!rangeData.windows().includes(month)) {
        return []
      }

      return this.categories
        .map(category => ({
          category,
          bills: this.typedMonthlyBills(month, type).filter(bill => bill.category === category._key)
        }))
        .filter(({ bills }) => bills.length > 0)
        .map(({ category, bills }) => ({
          category, bills,
          amount: bills.map(bill => bill.amount).reduce((a, b) => a + b)
        }))
        .sort(({ amount: amountA }, { amount: amountB }) => amountB - amountA)
    },

    typedCategoriesPieOption(type, month) {
      const summary = this.typedCategoriesSummary(type, month)

      if (summary.length <= 0) {
        return null
      }

      const seriesName = type === 0 ? '支出分类' : '收入分类' 

      return {
        dataset: {
          source: summary
        },
        tooltip: {},
        title: {
          text: seriesName + '占比',
          left: 'center'
        },
        series: {
          name: seriesName,
          type: 'pie',
          radius: [ '40%', '70%' ],
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          encode: {
            name: 'category',
            value: 'amount'
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => `
              ${params.seriesName}<br />
              ${params.value.category.name}: ${params.value.amount} (${params.percent}%)
            `
          }
        }
      }
    }
    
  }

}
</script>

<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 300px;
}

.digi {
  padding: 12px 20px;

  .digi-label, .digi-content {
    display: block;
    line-height: 21px;
  }

  .digi-content {
    font-size: 20px;
    line-height: 20px;

    .small {
      font-size: 12px;
      color: #808695;
    }
  }
}

.chart-tooltip {
  padding: 5px;

  .tooltip-title {
    background: rgba(200,200,200,.3);
    border-radius: 2px;
    padding: 3px;
    text-align: center;
  }
  
  .tooltip-bills, .tooltip-sum {
    padding: 2px;
  }

  .tooltip-sum {
    border-top: 1px solid rgba(200,200,200,.3);
  }
}

#categories-top-board {
  padding: 15px 35px;

  .category {
    margin-bottom: 20px;
  }
}
</style>

