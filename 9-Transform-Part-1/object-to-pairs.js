const pairs = keys.map(key => {
  return [ key, object[key] ]
})

console.log(pairs)
// => [
// ["name", "Chaoyang Gan"],
// ["title", "Engineer"],
// ["subject", "Maths"]
// ]