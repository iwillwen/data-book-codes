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
}