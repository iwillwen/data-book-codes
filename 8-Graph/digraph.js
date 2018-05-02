class Digraph {
  constructor(vertices, edges) {

    // Vertices
    this.vertexIds = []
    this.vertices = {}

    for (let i = 0; i < vertices.length; ++i) {
      const vertex = vertices[i]

      this.vertexIds.push(vertex.id)
      this.vertices[vertex.id] = vertex
    }

    const edgesWithId = edges.map(function(edge, i) {
      edge.id = i + 1
      return edge
    })

    // Edges
    this.edgeIds = []
    this.edges = {}
    this.inEgdeRelations = {}
    this.outEdgeRelations = {}

    for (let i = 0; i < edgesWithId.length; ++i) {
      const edge = edgesWithId[i]

      this.edgeIds.push(edge.id)
      this.edges[edge.id] = edge

      if (typeof this.outEdgeRelations[edge.originalId] === 'undefined') {
        this.outEdgeRelations[edge.originalId] = []
      }

      if (typeof this.inEgdeRelations[edge.targetId] === 'undefined') {
        this.inEgdeRelations[edge.targetId] = []
      }

      this.inEgdeRelations[edge.targetId].push(edge.id)
      this.outEdgeRelations[edge.originalId].push(edge.id)
    }

  }

  getVertex(vertexId) {
    if (!_.includes(this.vertexIds, vertexId)) {
      return null
    }

    return this.vertices[vertexId]
  }

  eachVertices(callbackFunc) {
    const self = this

    return self.vertexIds.forEach(function(vertexId) {
      return callbackFunc(self.vertices[vertexId])
    })
  }

  eachEdges(callbackFunc) {
    const self = this

    return self.edgeIds.forEach(function(edgeId) {
      return callbackFunc(self.edges[edgeId])
    })
  }

  getInEdgesByVertexId(vertexId) {
    if (!_.includes(this.vertexIds, vertexId)) {
      return []
    }

    if (!_.has(this.inEgdeRelations, vertexId)) {
      return []
    }

    const self = this

    return self.inEgdeRelations[vertexId].map(function(edgeId) {
      return self.edges[edgeId]
    })
  }

  getOutEdgesByVertexId(vertexId) {
    if (!_.includes(this.vertexIds, vertexId)) {
      return []
    }

    if (!_.has(this.outEdgeRelations, vertexId)) {
      return []
    }

    const self = this

    return self.outEdgeRelations[vertexId].map(function(edgeId) {
      return self.edges[edgeId]
    })
  }

  inDegree(vertexId) {
    return this.getInEdgesByVertexId(vertexId).length
  }

  outDegree(vertexId) {
    return this.getOutEdgesByVertexId(vertexId).length
  }

  largestInDegreeVertex() {
    const self = this

    const inDegrees = self.vertexIds.map(function(vertexId) {
      return {
        inDegree: self.inDegree(vertexId),
        id: vertexId
      }
    })

    return self.getVertex(_.maxBy(inDegrees, 'inDegree').id)
  }

  largestOutDegreeVertex() {
    const self = this

    const outDegrees = self.vertexIds.map(function(vertexId) {
      return {
        outDegree: self.outDegree(vertexId),
        id: vertexId
      }
    })

    return self.getVertex(_.maxBy(outDegrees, 'outDegree').id)
  }

  maxInDegree() {
    return this.inDegree(this.largestInDegreeVertex().id)
  }

  maxOutDegree() {
    return this.outDegree(this.largestOutDegreeVertex().id)
  }

  avgInDegree() {
    const self = this

    const totalInEdgesCount = self.vertexIds
      .map(function(vertexId) {
        if (typeof self.inEgdeRelations[vertexId] !== 'undefined') {
          return self.inEgdeRelations[vertexId]
        } else {
          return []
        }
      })
      .map(function(edges) {
        return edges.length
      })
      .reduce(function(a, b) {
        return a + b
      })

    return totalInEdgesCount / this.vertexIds.length
  }

  avgOutDegree() {
    const self = this

    const totalOutEdgesCount = self.vertexIds
      .map(function(vertexId) {
        if (typeof self.outEdgeRelations[vertexId] !== 'undefined') {
          return self.outEdgeRelations[vertexId]
        } else {
          return []
        }
      })
      .map(function(edges) {
        return edges.length
      })
      .reduce(function(a, b) {
        return a + b
      })

    return totalOutEdgesCount / this.vertexIds.length
  }

  loops() {
    const self = this

    return self.edgeIds
      .map(function(edgeId) {
        return self.edges[edgeId]
      })
      .filter(function(edge) {
        return edge.originalId === edge.targetId
      })
  }

  // Dijkstra's algorithm
  shortestPath(fromVertexId, toVertexId) {
    const self = this

    const preferQueue = []
    const rootNode = new Node(fromVertexId)
    const candidateTree = new Tree(rootNode)
    
    preferQueue.push(...self.getOutEdgesByVertexId(fromVertexId).map(function(edge) {
      return [ fromVertexId, edge.targetId ]
    }))

    while (preferQueue.length > 0) {
      const pair = preferQueue.shift()
      const parentVertexId = pair[0]
      const currentVertexId = pair[1]

      // Add the edge to the candidate tree
      const parentNodes = candidateTree.search(function(node) {
        return node.name === parentVertexId
      })
      const currentNode = new Node(currentVertexId)
      parentNodes.forEach(function(parentNode) {
        candidateTree.addNode(currentNode, parentNode)
      })

      if (currentVertexId === toVertexId) {
        continue
      }

      // Add the next vertex into the prefer queue
      let outEdges = self.getOutEdgesByVertexId(currentVertexId)

      if (outEdges.length <= 0) {
        continue
      }

      outEdges = outEdges.filter(function(edge) {
        return candidateTree.search(function(node) {
          return node.name === edge.targetId
        }).length === 0
      })

      preferQueue
        .push(...outEdges.map(function(edge) {
          return [ currentVertexId, edge.targetId ]
        }))
    }

    const targetNodes = candidateTree.search(function(node) {
      return node.name === toVertexId
    })

    if (targetNodes.length > 0) {
      const pathsWithDistance = targetNodes
        .map(function(node) {
          const vertexId = node.name
          const path = [ vertexId ]
          let lastNode = node

          while (lastNode.parent != null) {
            path.push(lastNode.parent.name)
            lastNode = lastNode.parent
          }

          return path.reverse()
        })
        .map(function(path) {
          const distance = path
            .map(function(vertexId, index) {
              const nextVertexId = path[index + 1]

              if (typeof nextVertexId === 'undefined') {
                return
              }

              const edge = self.getOutEdgesByVertexId(vertexId)
                .find(function(edge) {
                  return edge.targetId === nextVertexId
                })
              
              return edge
            })
            .filter(function(edge) {
              return typeof edge !== 'undefined'
            })
            .map(function(edge) {
              return edge.property
            })
            .reduce(function(distanceA, distanceB) {
              return distanceA + distanceB
            })

          return { path, distance }
        })
      
      const shortestPath = _.minBy(pathsWithDistance, 'distance')

      shortestPath.path = shortestPath.path.map(function(vertexId) {
        return self.getVertex(vertexId)
      })

      return shortestPath
    } else {
      return {
        path: [],
        distance: Infinity
      }
    }
  }
}