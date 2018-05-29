const str = '1,2,3,4,5'
const arr = str.split(',')

console.log(arr) //=> [ 1, 2, 3, 4, 5 ]

// ---------------------------------------

const arr = [ 1, 2, 3, 4, 5 ]

console.log(arr.join()) //=> 1,2,3,4,5
console.log(arr.join('#')) //=> 1#2#3#4#5