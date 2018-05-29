const jsonStr = `{
  "name": "Chaoyang Gan",
  "nickname": "iwillwen"
}`

eval('var me = ' + jsonStr)

console.log(me.name) //=> Chaoyang Gan