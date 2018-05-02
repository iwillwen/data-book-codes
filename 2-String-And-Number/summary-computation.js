let S = 0
const L = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
const n = L.length

for (let i = 0; i < n; ++i) {
  S += L[i]
}

console.log(S) //=> 55