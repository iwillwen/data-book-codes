class Graph {
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
    this.egdeRelations = {}

    for (let i = 0; i < edgesWithId.length; ++i) {
      const edge = edgesWithId[i]

      this.edgeIds.push(edge.id)
      this.edges[edge.id] = edge
      
      if (typeof this.egdeRelations[edge.leftId] === 'undefined') {
        this.egdeRelations[edge.leftId] = []
      }

      if (typeof this.egdeRelations[edge.rightId] === 'undefined') {
        this.egdeRelations[edge.rightId] = []
      }

      this.egdeRelations[edge.leftId].push(edge.id)
      this.egdeRelations[edge.rightId].push(edge.id)
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

  getEdgesByVertexId(vertexId) {
    if (!_.includes(this.vertexIds, vertexId)) {
      return []
    }

    if (!_.has(this.egdeRelations, vertexId)) {
      return []
    }

    const self = this

    return self.egdeRelations[vertexId].map(function(edgeId) {
      return self.edges[edgeId]
    })
  }

  degree(vertexId) {
    return this.getEdgesByVertexId(vertexId).length
  }

  largestVertex() {
    const self = this

    const degrees = self.vertexIds.map(function(vertexId) {
      return {
        degree: self.degree(vertexId),
        id: vertexId
      }

    })

    return self.getVertex(_.maxBy(degrees, 'degree').id)
  }

  maxDegree() {
    return this.degree(this.largestVertex().id)
  }

  avgDegree() {
    return 2 * this.edgeIds.length / this.vertexIds.length
  }

  loops() {
    const self = this

    return self.edgeIds
      .map(function(edgeId) {
        return self.edges[edgeId]
      })
      .filter(function(edge) {
        return edge.leftId === edge.rightId
      })
  }
}