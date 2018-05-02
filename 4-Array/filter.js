const array = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
const evenNumbers = array.filter(function(x) {
  return x % 2 == 0
})

console.log(evenNumbers) //=> [2, 4, 6, 8]