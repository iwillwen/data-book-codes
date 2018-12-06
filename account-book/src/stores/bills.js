import Model from './model'

const Bill = Model.extend('bill', {
  type: Number,
  timestamp: Number,
  label: String,
  category: String,
  amount: Number,
  description: '', // Default empty
})

Bill.setIndex('type')
Bill.setIndex('category')

export default Bill
