const array = [ 1, 2, 3, 4, 5 ]

const mean = _.mean(array)

console.log(mean) //=> 3

// ----------------------------------------------------

const crew = [
  {
    name: 'Peter',
    gender: 'male',
    level: 'Product Manager',
    age: 32
  },
  {
    name: 'Ben',
    gender: 'male',
    level: 'Senior Developer',
    age: 28
  },
  {
    name: 'Jean',
    gender: 'female',
    level: 'Senior Developer',
    age: 26
  },
  {
    name: 'Chang',
    gender: 'male',
    level: 'Developer',
    age: 23
  },
  {
    name: 'Siva',
    gender: 'female',
    level: 'Quality Assurance',
    age: 25
  }
]

const ages = _.map(crew, function(person) {
  return person.age
})
const meanAge = _.mean(ages)

console.log(meanAge) //=> 26.8

// ----------------------------------------------------

const meanAge = _.meanBy(crew, 'age')