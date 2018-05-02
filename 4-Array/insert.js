const array = [ 1, 2, 6, 7 ]

array.splice(2, 0, 3)
console.log(array) //=> [1, 2, 3, 6, 7]

array.splice(3, 0, 4, 5)
console.log(array) //=> [1, 2, 3, 4, 5, 6, 7]