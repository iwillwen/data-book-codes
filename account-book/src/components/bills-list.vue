<template>
  <div>
    <Card :padding="0">
      <Row>
        <Col span="8" class="digi">
          <DatePicker
            :open="seletingMonth"
            :value="selectedMonth"
            @on-change="handleSelectMonth"
            format="yyyy-MM"
            type="month"
          >
            <div @click="controlMonthSelector()" :style="{ cursor: 'pointer' }">
              <span class="digi-label">{{ selectedMonth.substr(0, 4) }}</span>
              <span class="digi-content">{{ parseInt(selectedMonth.substr(5)) }} 月 <Icon type="ios-arrow-down" :size="16" /></span>
            </div>
          </DatePicker>
        </Col>
        <Col span="8" class="digi">
          <span class="digi-label">支出</span>
          <span class="digi-content">¥{{ (monthlyExpense[selectedMonth] || 0).toFixed(1) }}</span>
        </Col>
        <Col span="8" class="digi">
          <span class="digi-label">收入</span>
          <span class="digi-content">¥{{ (monthlyIncome[selectedMonth] || 0).toFixed(1) }}</span>
        </Col>
      </Row>
    </Card>
    <Button type="primary" long @click="newBill" :style="{ margin: '10px 0' }">
      <Icon type="md-add" />
      新建账单
    </Button>
    <Card title="本月账单列表" id="bills-list-card" :padding="0">
      <div v-for="date in datesData.windows().desc" :key="date">
        <CellGroup @on-click="selectBill">
          <Divider orientation="left" class="date-divider">{{date}} <Divider type="vertical" /> 总和：{{dailySum(date)}}</Divider>
          <Cell
            v-for="bill in sortBills(datesData.map[date])"
            :key="bill._key"
            :name="bill._key"
            
            :title="bill.label"
            :label="(categoriesMap[bill.category] || { name: '未知分类' }).name"
            :extra="(bill.type === 0 ? 0 - bill.amount: bill.amount).toString()"
          />
        </CellGroup>
      </div>
      <div v-if="datesData.windows().length <= 0" id="empty-help">
        该月暂无账单数据
      </div>
    </Card>
  </div>
</template>

<script>
import Bill from '../stores/bills'
import Category from '../stores/categories'
import createTimeSeries from '../utils/timeserie'
import currentState from '../states/current'
import * as moment from 'moment'
import { fromPairs, groupBy, mapValues } from 'lodash'

export default {
  name: 'bills-list',

  data() {
    const currentMonth = moment().format('YYYY-MM')
    currentState.dispatch('selectMonth', currentMonth)

    return {
      bills: [],
      categories: [],
      selectedMonth: currentMonth,
      seletingMonth: false
    }
  },

  computed: {

    categoriesMap() {
      return mapValues(groupBy(this.categories, '_key'), ([ category ]) => category)
    },

    expenseBills() {
      return this.bills.filter(bill => bill.type === 0)
    },

    incomeBills() {
      return this.bills.filter(bill => bill.type === 1)
    },

    monthlyExpense() {
      const timeseries = createTimeSeries(this.expenseBills).groupByMonth()

      return fromPairs(
        timeseries.windows().map(month => {
          return [ month, timeseries.sumBy(month, 'amount') ]
        })
      )
    },

    monthlyIncome() {
      const timeseries = createTimeSeries(this.incomeBills).groupByMonth()

      return fromPairs(
        timeseries.windows().map(month => {
          return [ month, timeseries.sumBy(month, 'amount') ]
        })
      )
    },

    datesData() {
      return createTimeSeries(createTimeSeries(this.bills).groupByMonth().map[this.selectedMonth] || []).groupByDate()
    },

  },

  created() {
    this.loadBills()
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

    this.loadCategories()
    Category.events
      .on('instance-added', () => this.loadCategories())
      .on('instance-updated', () => this.loadCategories())
      .on('instance-removed', () => this.loadCategories())
  },

  methods: {

    async loadBills() {
      this.bills = await Bill.dump()
    },

    async loadCategories() {
      this.categories = await Category.dump()
    },

    groupBy(window = 'date') {
      switch (window) {
        case 'date':
          return this.timeseries.groupByDate()
        
        case 'week':
          return this.timeseries.groupByWeek()

        case 'month':
          return this.timeseries.groupByMonth()

        case 'year':
          return this.timeseries.groupByYear()
      }
    },

    createTimeSeries,

    newBill() {
      currentState.dispatch('controlNewBillDrawer', true)
    },

    async removeBill(key) {
      await Bill.remove(key)
    },

    controlMonthSelector(opened = !this.seletingMonth) {
      this.seletingMonth = opened
    },

    handleSelectMonth(month) {
      this.selectedMonth = month
      currentState.dispatch('selectMonth', month)
      this.controlMonthSelector()
    },

    selectBill(key) {
      currentState.dispatch('selectBill', key)
      currentState.dispatch('controlNewBillDrawer', true)
    },

    sortBills(bills) {
      return bills.sort((billA, billB) => billB.timestamp - billA.timestamp)
    },

    dailySum(date) {
      return this.datesData.sumBy(date, 'amount', bill => ({
        amount: bill.type === 0 ? 0 - bill.amount : bill.amount
      }))
    }
  }

}
</script>

<style lang="less">
#bills-list-card {
  min-height: 300px;

  #empty-help {
    width: 100%;
    height: 100%;
    line-height: 249px;

    text-align: center;
  }
}

.date-divider {
  margin: 10px 0 0 0 !important;
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
  }
}
</style>
