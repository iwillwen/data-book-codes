const obj = {
  foo: 'bar',
  1: 2,
  'a b c': 'd e f',
  [Symbol.for('foo')]: 'bar'
}

obj.foo = 'rab'
obj[1] = 3
console.log(obj.foo) //=> rab
console.log(obj[1]) //=> 3

// ----------------------------------------------------

const obj = {}

obj.foo = 'bar'
obj[1] = 2

// ----------------------------------------------------

const outer = {
  inner: {}
}

outer.inner.foo = 'bar' // OK
outer.something.bar = 1 // Error!