const somethingImportant = 'some secret'

const jsonStr = `{
  "attack": (function(){
    alert(somethingImportant)
  })()
}`

eval('var me = ' + jsonStr) //=> some secret