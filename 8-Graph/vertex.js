class Vertex {
  constructor(id, property) {
    this.id = id
    this.property = property
  }
}

let vertexId = 0
function newVertex(property) {
  return new Vertex(++vertexId, property)
}