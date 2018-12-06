<template>
  <Drawer
    title="新建账单"
    :value="isOpened"
    @on-visible-change="controlDrawer"
    width="500"
  >
    <Form id="creating-form" :model="creatingForm" :label-width="60">
      <FormItem label="类型">
        <RadioGroup v-model="creatingForm.type" type="button">
          <Radio :label="0">支出</Radio>
          <Radio :label="1">收入</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="账单分类">
        <Row>
          <Col span="16">
            <Select v-model="selectedCategoryKey">
              <Option
                v-for="category in categories.filter(({ type }) => type === creatingForm.type)"
                :key="category._key"
                :value="category._key"
              >
                {{ category.name }}
              </Option>
            </Select>
          </Col>
          <Col span="6" offset="1">
            <Button
              type="primary"
              @click="controlCategoriesDrawer(true)"
            >
              管理分类账单
            </Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="日期">
        <DatePicker
          type="date"
          v-model="date"
        />
      </FormItem>
      <FormItem label="名称">
        <Input
          v-model="creatingForm.label"
          :placeholder="labelPlaceholder"
        />
      </FormItem>
      <FormItem label="金额">
        <InputNumber
          :max="100000"
          style="width: 30%"
          v-model="creatingForm.amount"
          :formatter="value => `¥ ${value.toFixed(2)}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
          :parser="value => value.replace(/¥s?|(,*)/g, '')"
        />
      </FormItem>
      <FormItem label="备注">
        <Input
          v-model="creatingForm.description"
          type="textarea"
        />
      </FormItem>
      <FormItem>
        <Row :gutter="5">
          <Col span="18">
            <Button type="primary" long @click="createBill">
              {{!isEditing ? '创建' : '修改'}}
            </Button>
          </Col>
          <Col span="6">
            <Button long @click="reset">重置</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </Drawer>
</template>

<script>
import Bill from '../stores/bills'
import Category from '../stores/categories'
import currentState from '../states/current'
import * as moment from 'moment'
import Vue from 'vue'

export default {
  
  name: 'new-bill-drawer',

  computed: {

    editingBillKey() {
      return currentState.state.billKey
    },

    isEditing() {
      return this.editingBillKey.length > 0
    },

    isOpened() {
      return currentState.state.openedNewBillDrawer
    },

    selectedCategory() {
      return this.categories.find(({ _key }) => _key === this.selectedCategoryKey)
    },

    labelPlaceholder() {
      return !this.selectedCategoryKey || this.selectedCategoryKey.length <= 0 ? '账单名称' : this.selectedCategory.name
    }
  },

  data() {
    return {
      categories: [],

      selectedCategoryKey: '',

      date: moment().toDate(),

      creatingForm: {
        type: 0,
        label: '',
        amount: 0,
        description: ''
      }
    }
  },

  watch: {
    ['creatingForm.type']() {
      this.selectedCategoryKey = ''
    },

    async ['editingBillKey']() {
      await this.loadCategories()
      if (this.isEditing) {
        const bill = (await Bill.fetch(this.editingBillKey)).getCacheData()
        this.creatingForm.type = bill.type
        Vue.nextTick(() => {
          this.date = new Date(bill.timestamp)
          this.creatingForm.label = bill.label
          this.creatingForm.amount = bill.amount
          this.creatingForm.description = bill.description
          this.selectedCategoryKey = bill.category
        })
      }
    }
  },

  mounted() {
    this.loadCategories()

    Category.events
      .on('instance-added', () => this.loadCategories())
      .on('instance-updated', () => this.loadCategories())
      .on('instance-removed', () => this.loadCategories())
  },

  methods: {

    reset() {
      this.selectedCategoryKey = ''
      this.date = moment().toDate(),
      this.creatingForm.type = 0
      this.creatingForm.label = ''
      this.creatingForm.amount = 0
      this.creatingForm.description = ''
    },

    async createBill() {
      if (!this.isEditing) {
        new Bill({
          type: this.creatingForm.type,
          timestamp: this.date.valueOf(),
          label: this.creatingForm.label.length <= 0 ? this.selectedCategory.name : this.creatingForm.label,
          category: this.selectedCategory._key,
          amount: this.creatingForm.amount,
          description: this.creatingForm.description
        })
      } else {
        await this.updateBill()
      }
      this.reset()
      this.controlDrawer(false)
    },

    async updateBill() {
      const bill = await Bill.fetch(this.editingBillKey)
      await bill.set('type', this.creatingForm.type)
      await bill.set('timestamp', this.date.valueOf())
      await bill.set('label', this.creatingForm.label)
      await bill.set('category', this.selectedCategoryKey)
      await bill.set('amount', this.creatingForm.amount)
      await bill.set('description', this.creatingForm.description)
    },

    async loadCategories() {
      this.categories = await Category.dump()
    },

    controlDrawer(opened) {
      currentState.dispatch('controlNewBillDrawer', opened)

      if (!opened) {
        this.reset()
        currentState.dispatch('selectBill', '')
      }
    },

    controlCategoriesDrawer(opened) {
      currentState.dispatch('controlCategoriesDrawer', opened)
    },
  }

}
</script>

<style lang="less" scoped>
#creating-form {
  width: 90%;
}
</style>
