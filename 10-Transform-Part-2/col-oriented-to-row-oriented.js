const empsColumns = {
  RowId: [ '001', '002', '003', '004', '005' ],
  EmpId: [ '10', '12', '11', '22', '24' ],
  Lastname: [ 'Smith', 'Jones', 'Johnson', 'Jones', 'Steve' ],
  Firstname: [ 'Joe', 'Mary', 'Cathy', 'Bob', 'Mike' ],
  Salary: [ 40000, 50000, 44000, 55000, 62000 ]
}

function rowOriented2ColOriented(colDataset) {
  const columnNames = _.keys(colDataset)

  const n = _.max(columnNames.map(function(colName) {
    return colDataset[colName].length
  }))

  const rowDataset = []

  for (let i = 0; i < n; ++i) {
    const row = {}

    columnNames.forEach(function(colName) {
      if (!_.isNil(colDataset[colName][i])) {
        row[colName] = colDataset[colName][i]
      }
    })

    rowDataset[i] = row
  }

  return rowDataset
}

const empsRows = rowOriented2ColOriented(empsColumns)

console.log(empsRows)
//=> [
//   { RowId: '001', EmpId: '10', Lastname: 'Smith', Firstname: 'Joe', Salary: 40000 },
//   { RowId: '002', EmpId: '12', Lastname: 'Jones', Firstname: 'Mary', Salary: 50000 },
//   { RowId: '003', EmpId: '11', Lastname: 'Johnson', Firstname: 'Cathy', Salary: 44000 },
//   { RowId: '004', EmpId: '22', Lastname: 'Jones', Firstname: 'Bob', Salary: 55000 },
//   { RowId: '005', EmpId: '24', Lastname: 'Steve', Firstname: 'Mike', Salary: 62000 }
// ]