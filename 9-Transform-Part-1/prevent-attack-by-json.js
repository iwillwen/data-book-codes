JSON.parse(`{
  "attack": (function(){
    alert(somethingImportant)
  })()
}`) //=> SyntaxError: Unexpected token ( in JSON