
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return array.length === 0
  ? 0
  : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}

// const array = {
//    x: [1, 2, 3, 4, 5],
//    y: [1, 2, 3, 4, 5],
//    z: [1, 2, 3, 4, 5]
// }



// const reverse = (string) => {
//     return string
//       .split('')
//       .reverse()
//       .join('')
//   }
//   const resultSum = array.x.concat(array.y, array.z) 
//   const average = (resultSum) => {
//     const reducer = (sum, item) => {
//       return sum + item
//     }
//     const a= resultSum.reduce(reducer, 0)
//     console.log('A', a)
//     return a / (array.x.length + array.y.length + array.z.length)
// }

// console.log('Array', average(resultSum))
//   module.exports = {
//     reverse,
//     average,
//   }