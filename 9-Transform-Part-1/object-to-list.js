const list = keys.map(key => {
  return {
    key, value: object[key]
  }
})

console.log(list)
//=> [
// {key: "name", value: "Chaoyang Gan"},
// {key: "title", value: "Engineer"},
// {key: "subject", value: "Maths"}
// ]