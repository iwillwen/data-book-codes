const x = 1024

function getBaseLog(base, x) {
  return Math.log(x) / Math.log(base)
}

const baseLog = {
  2: getBaseLog(2, x),
  e: getBaseLog(Math.E, x),
  10: getBaseLog(10, x)
}

console.log(baseLog) //=> {2: 10, 10: 3.0102999566398116, e: 6.931471805599453}