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

function isLast(i, length) {
  return (i + 1) === length
}

function seq2Pairs(seq) {
  return seq
    .map(function(node, i) {
      if (isLast(i, seq.length)) {
        return false
      }

      return [ node, seq[i + 1] ]
    })
    .filter(function(pair) {
      return pair && pair.length === 2
    })
}

function analyzeDegrees(pairs) {
  const analysis = {}

  for (const pair of pairs) {
    const [ left, right ] = pair

    if (!analysis[left]) {
      analysis[left] = {
        in: 0, out: 0
      }
    }
    if (!analysis[right]) {
      analysis[right] = {
        in: 0, out: 0
      }
    }

    analysis[left].out += 1
    analysis[right].in += 1
  }

  return _.toPairs(analysis)
    .map(([ node, degrees ]) => ({ node, ...degrees }))
}

function findRootNodes(analysis) {
  return analysis.filter(({ in: inDegree }) => inDegree === 0)
}

const pairs = sequences
  .map(function(sequence) {
    return seq2Pairs(sequence)
  })
  .reduce(function(left, right) {
    return left.concat(right)
  })

const analysis = analyzeDegrees(pairs)
const rootNodes = findRootNodes(analysis).map(function(result) {
  return result.node
})

const root = new Node('*')
const tree = new Tree(root)

for (const nodeName of rootNodes) {
  const node = new Node(nodeName)

  root.addChild(node)
}

const penddingSeqs = sequences.slice()

while (penddingSeqs.length > 0) {
  const currentSeq = penddingSeqs.shift()

  const hit = tree.search(function(node) {
    return node.name === currentSeq[0]
  }).shift()

  if (!hit) {
    penddingSeqs.push(currentSeq)
    continue
  }

  let lastNode = hit
  currentSeq.shift()

  while (currentSeq.length > 0) {
    const currentNodeName = currentSeq.shift()

    const currentNode = lastNode.children.find(function(node) {
      return node.name === currentNodeName
    })

    if (currentNode) {
      lastNode = currentNode
    } else {
      const node = new Node(currentNodeName)
      lastNode.addChild(node)

      lastNode = node
    }
  }
}

console.log(root.toString())
//=>
// *
//   A
//     B
//       C
//         D
//       D
//         E
//       F
//         G
//           H
//             I
//   J
//     G
//       H
//         I