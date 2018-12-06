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

class Node {
  constructor(name) {
    this.name = name
    this.parent = null
    this.children = []
  }
  
  addChild(node) {
    node.parent = this
    this.children.push(node)

    return this
  }

  siblings() {
    const self = this
  
    if (this.parent) {
      return this.parent.children.filter(function(node) {
        return node !== self
      })
    } else {
      return []
    }
  }

  get degree() {
    return this.children.length
  }

  getDepthByRoot(root) {
    let depth = 0
    let currNode = this

    while (currNode.parent !== root) {
      depth++
      currNode = currNode.parent
    }

    return depth + 1
  }

  get depth() {
    return this.getDepthByRoot(null)
  }

  get height() {
    const queue = [ this ]
    let deepestNode = this

    while (queue.length > 0) {
      const len = queue.length

      for (let i = 0; i < len; ++i) {
        const currNode = queue.shift()

        deepestNode = currNode

        if (currNode.children.length > 0) {
          queue.push(...currNode.children)
        }
      }
    }

    return deepestNode.getDepthByRoot(this)
  }

  toString(join = true) {
    let parts = [ this.name ]

    if (this.children.length > 0) {
      parts = parts.concat(this.children
        .map(function(node) {
          return node.toString(false)
        })
        .reduce(function(left, right) {
          return left.concat(right)
        })
        .map(function(line) {
          return '  ' + line
        })
      )
    }

    if (join) {
      return parts.join('\n')
    } else {
      return parts
    }
  }
}

class Tree {

  constructor(root) {
    this.root = root
  }

  addNode(node, parent = this.root) {
    parent.addChild(node)
  }

  search(validator) {
    const queue = [ this.root ]
    const result = []

    while (queue.length > 0) {
      const currNode = queue.shift()

      if (validator(currNode)) {
        result.push(currNode)
        continue
      }

      if (currNode.children.length > 0) {
        arrayUtils.prepend(queue, ...currNode.children)
      }
    }

    return result
  }

  get size() {
    let size = 0
    const bag = [ this.root ]

    while (bag.length > 0) {
      const currNode = bag.shift()

      size++

      if (currNode.children.length > 0) {
        arrayUtils.prepend(bag, ...currNode.children)
      }
    }

    return size
  }

  get height() {
    return this.root.height
  }

  toString() {
    return this.root.toString()
  }
}

const sequences = [
  [ 'A', 'B', 'C' ],
  [ 'B', 'C', 'D' ],
  [ 'B', 'D', 'E' ],
  [ 'B', 'F', 'G' ],
  [ 'F', 'G', 'H' ],
  [ 'F', 'G', 'H', 'I' ],
  [ 'J', 'G' ],
  [ 'J', 'G', 'H' ],
  [ 'J', 'G', 'H', 'I' ]
]

const root = new Node('*')

sequences.forEach(function(sequence) {
  let lastNode = root
  
  sequence.forEach(function(nodeName, i) {
    const index = lastNode.children.findIndex(function(child) {
      return child.name === nodeName
    })

    if (index >= 0) {
      lastNode = lastNode.children[index] // found an exits node
    } else {

      const node = new Node(nodeName)

      lastNode.addChild(node)

      lastNode = node
    }
  })
})

console.log(root.toString())
//=>
// *
//   A
//     B
//       C
//   B
//     C
//       D
//     D
//       E
//     F
//       G
//   F
//     G
//       H
//         I
//   J
//     G
//       H
//         I