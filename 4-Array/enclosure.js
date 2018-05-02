const arrayUtils = {

  append(array, ...elements) {
    array.push(...elements)
    
    return array
  },
  
  prepend(array, ...elements) {
    array.unshift(...elements)
    
    return array
  },
  
  insert(array, index, ...elements) {
    array.splice(index, 0, ...elements)
    
    return array
  },

  remove(array, index) {
    array.splice(index, 1)

    return array
  }
}

// 使用
const array = []
arrayUtils.append(array, 3)    // 末端添加元素 3
arrayUtils.prepend(array, 1)   // 首端添加元素 1
arrayUtils.insert(array, 1, 2) // 在位置 1 添加元素 2

console.log(array) //=> [1, 2, 3]
