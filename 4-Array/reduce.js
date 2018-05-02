const array = [ 1, 2, 3, 4 ]

const sumResult = array.reduce(function(left, right) {
  return left + right
})

console.log(sumResult) //=> 10

// ----------------------------------------------------

const array = [ 1, 2, 3, 4 ]

function sum(array) {
  return array.reduce(function(left, right) {
    return left + right
  })
}

function multi(array) {
  return array.reduce(function(left, right) {
    return left * right
  })
}

console.log(sum(array))   //=> 10
console.log(multi(array)) //=> 24

// ----------------------------------------------------

const array = [ 1, 2, 3, 4 ]

function reduceFn(callback) {
  return function(array) {
    return array.reduce(callback)
  }
}

const sum = reduceFn(function(left, right) {
  return left + right
})
const multi = reduceFn(function(left, right) {
  return left * right
})

console.log(sum(array))   //=> 10
console.log(multi(array)) //=> 24