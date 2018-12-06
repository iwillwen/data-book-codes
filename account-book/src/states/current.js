import Vuex from 'vuex'

const state = new Vuex.Store({
  state: {
    billKey: '',
    selectedMonth: '2006-01',
    openedCategoriesDrawer: false,
    openedNewBillDrawer: false,
  },
  mutations: {
    selectBill(state, key) {
      state.billKey = key
    },
    selectMonth(state, month) {
      state.selectedMonth = month
    },
    controlCategoriesDrawer(state, opened) {
      state.openedCategoriesDrawer = opened
    },
    controlNewBillDrawer(state, opened) {
      state.openedNewBillDrawer = opened
    }
  },
  actions: {
    selectBill(context, key) {
      context.commit('selectBill', key)
    },
    selectMonth(context, month) {
      context.commit('selectMonth', month)
    },
    controlCategoriesDrawer(context, opened) {
      context.commit('controlCategoriesDrawer', opened)
    },
    controlNewBillDrawer(context, opened) {
      context.commit('controlNewBillDrawer', opened)
    }
  }
})

export default state