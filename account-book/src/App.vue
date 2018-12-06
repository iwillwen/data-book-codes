<template>
  <div id="app">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" @on-select="selectMenu">
          <div id="logo">
            账本 App
          </div>
          <div id="nav">
            <MenuItem name="categories">
              <Icon type="ios-apps" />
              账单分类管理
            </MenuItem>
          </div>
        </Menu>
      </Header>

      <Layout id="content-layout">
        <Sider hide-trigger width="400" id="sidebar">
          <bills-list />
        </Sider>
        <Content>
          <analytics :selectedMonth="state.selectedMonth" />
        </Content>
      </Layout>
    </Layout>
    <new-bill-drawer :opened="newBillDrawerOpened" />
    <categories-drawer :opened="categoriesDrawerOpened" />
  </div>
</template>

<script>
import BillsList from './components/bills-list.vue'
import Analytics from './components/analytics.vue'
import CategoriesDrawer from './components/categories-drawer.vue'
import NewBillDrawer from './components/new-bill-drawer.vue'

import currentState from './states/current'

export default {
  name: 'app',
  components: {
    BillsList,
    Analytics,
    CategoriesDrawer,
    NewBillDrawer,
  },

  computed: {
    state() {
      return currentState.state
    },

    categoriesDrawerOpened() {
      return currentState.state.openedCategoriesDrawer
    },

    newBillDrawerOpened() {
      return currentState.state.openedNewBillDrawer
    }
  },

  methods: {
    controlCategoriesDrawer(opened = !this.categoriesDrawerOpened) {
      currentState.dispatch('controlCategoriesDrawer', opened)
    },

    controlNewBillDrawer(opened = !this.newBillDrawerOpened) {
      currentState.dispatch('controlNewBillDrawer', opened)
    },

    selectMenu(name) {
      switch (name) {
        case 'categories':
          currentState.dispatch('controlCategoriesDrawer', true)
      }
    }
  }
}
</script>

<style>
#logo {
  display: inline-block;
  color: #fff;
  font-size: 1.2rem;
  float: left;
}

#nav {
  width: 400px;
  float: left;
}

#content-layout {
  max-width: 1400px;
  width: 90vw;
  padding: 25px 0;
  margin: 0 auto;
}

#sidebar {
  background: transparent;
  padding-right: 15px;
}
</style>
