const empsRows = [
  { RowId: '001', EmpId: '10', Lastname: 'Smith', Firstname: 'Joe', Salary: 40000 },
  { RowId: '002', EmpId: '12', Lastname: 'Jones', Firstname: 'Mary', Salary: 50000 },
  { RowId: '003', EmpId: '11', Lastname: 'Johnson', Firstname: 'Cathy', Salary: 44000 },
  { RowId: '004', EmpId: '22', Lastname: 'Jones', Firstname: 'Bob', Salary: 55000 },
  { RowId: '005', EmpId: '24', Lastname: 'Steve', Firstname: 'Mike', Salary: 62000 }
]

function applyColumn(colDataset, columnName) {
  if (!_.has(colDataset, columnName)) {
    colDataset[columnName] = []
  }

  return colDataset
}

function rowOriented2ColOriented(rowDataset) {
  let colDataset = {}

  rowDataset.forEach(function(row, i) {
    const columnNames = _.keys(row)

    columnNames.forEach(function(columnName) {
      colDataset = applyColumn(colDataset, columnName)
      colDataset[columnName][i] = row[columnName]
    })
  })

  return colDataset
}

const empsColumns = rowOriented2ColOriented(empsRows)

console.log(empsColumns)
//=> {
//  RowId: [ '001', '002', '003', '004', '005' ],
//  EmpId: [ '10', '12', '11', '22', '24' ],
//  Lastname: [ 'Smith', 'Jones', 'Johnson', 'Jones', 'Steve' ],
//  Firstname: [ 'Joe', 'Mary', 'Cathy', 'Bob', 'Mike' ],
//  Salary: [ 40000, 50000, 44000, 55000, 62000 ]
// }