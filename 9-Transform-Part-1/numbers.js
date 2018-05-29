const n1 = 1
const n2 = 1.2

const s1 = n1.toString()
const s2 = n2.toString()

console.log(s1, typeof s1) //=> 1 string
console.log(s2, typeof s2) //=> 1.2 string

// -----------------------------------------------

const int = 5
const pi = Math.PI //=> 3.141592653589793 (约等于)

console.log(int.toFixed(2)) //=> '5.00'
console.log(pi.toFixed(2)) //=> '3.14'
console.log(int.toFixed(pi)) //=> '5.000'

// ----------------------------------------------

console.log(parseInt('5.00')) //=> 5
console.log(parseFloat('3.14')) //=> 3.14