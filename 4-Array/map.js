const array = [ 1, 2, 3, 4, 5 ]

const addedArray = array.map(function(x) {
  return x + 2
})

console.log(addedArray) //=> [3,4,5,6,7]

// ----------------------------------------------------

const asciiArray = [ 72, 101, 108, 108, 111, 87, 111, 114, 108, 100 ]

const charArray = asciiArray.map(function(ascii) {
  return String.fromCharCode(ascii)
})

console.log(charArray) //=> ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"]