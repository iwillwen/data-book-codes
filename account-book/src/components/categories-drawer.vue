<template>
  <Drawer
    title="账单分类"
    :value="isOpened"
    @on-visible-change="controlDrawer"
    width="400"
  >
    <CellGroup>
      <Divider>支出分类</Divider>
      <Cell
        v-for="category in expenseCategories"
        :key="category._key"
        :name="category.name"
        :title="category.name"
      >
        <span slot="extra">
          <Button size="small" style="margin-right: 5px" @click="showEditModel(category)">修改</Button>
          <Button type="error" size="small" @click="removeCategory(category)">删除</Button>
        </span>
      </Cell>
      <span v-if="expenseCategories.length <= 0" class="empty-tip">暂无</span>
    </CellGroup>

    <CellGroup>
      <Divider>收入分类</Divider>
      <Cell
        v-for="category in incomeCategories"
        :key="category._key"
        :name="category.name"
        :title="category.name"
      >
        <span slot="extra">
          <Button size="small" style="margin-right: 5px" @click="showEditModel(category)">修改</Button>
          <Button type="error" size="small" @click="removeCategory(category)">删除</Button>
        </span>
      </Cell>
      <span v-if="incomeCategories.length <= 0" class="empty-tip">暂无</span>
    </CellGroup>

    <Divider>新建账单分类</Divider>

    <Form :model="creatingForm" inline width="100%">
      <FormItem label="类型" :label-width="80">
        <RadioGroup v-model="creatingForm.type" type="button">
          <Radio :label="0">支出</Radio>
          <Radio :label="1">收入</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="分类名称" :label-width="80">
        <Input v-model="creatingForm.name" />
      </FormItem>
      <FormItem>
        <Button type="primary" @click="createCategory">创建</Button>
      </FormItem>
    </Form>
  </Drawer>
</template>

<script>
import Category from '../stores/categories'
import currentState from '../states/current'

export default {
  name: 'categories-drawer',

  data() {
    return {
      categories: [],

      creatingForm: {
        type: 0,
        name: ''
      },

      editingName: ''
    }
  },

  computed: {
    isOpened() {
      return currentState.state.openedCategoriesDrawer
    },

    expenseCategories() {
      return this.categories.filter(({ type }) => type === 0)
    },

    incomeCategories() {
      return this.categories.filter(({ type }) => type === 1)
    }
  },

  async mounted() {
    this.categories = await Category.dump()
    Category.events
      .on('instance-added', category => this.categories.push(category.getCacheData()))
      .on('instance-updated', (key, field, value) => {
        const category = this.categories.find(category => category._key === key)
        category[field] = value
      })
      .on('instance-removed', key => {
        const index = this.categories.findIndex(category => category._key === key)
        this.categories.splice(index, 1)
      })
  },

  methods: {
    createCategory() {
      new Category({
        type: this.creatingForm.type,
        name: this.creatingForm.name
      })
      this.creatingForm.name = ''
    },

    showEditModel(category) {
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              value: category.name,
              autofocus: true,
              placeholder: ' 请输入新名称'
            },
            on: {
              input: value => {
                this.editingName = value
              }
            }
          })
        },
        onOk: async () => {
          const categoryModel = await Category.fetch(category._key)
          await categoryModel.set('name', this.editingName)
        }
      })
    },

    removeCategory(category) {
      this.$Modal.warning({
        title: '正在删除账单分类',
        content: `确定要删除账单分类 ${category.name} 吗？`,

        onOk: async () => {
          await Category.remove(category._key)
        }
      })
    },

    controlDrawer(opened) {
      currentState.dispatch('controlCategoriesDrawer', opened)
    }
  }
}
</script>

<style lang="less" scoped>
.empty-tip {
  display: block;
  text-align: center;
}
</style>
