const originalText = 'Hey dude, how is it going?'

const words = originalText.toLowerCase().match(/\w+/g)

console.log(words.length) //=> 6