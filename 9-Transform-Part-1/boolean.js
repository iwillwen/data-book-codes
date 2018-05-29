console.log(true.toString()) //=> 'true'
console.log(false.toString()) //=> 'false'

// ------------------------------------------

true == 'true' //=> false
false == 'false' //=> false

true == 1 //=> true
false == 0 //=> true

// ------------------------------------------

function parseBoolean(string) {
  return string === 'true'
}

console.log(parseBoolean('true')) //=> true
console.log(parseBoolean('false')) //=> false