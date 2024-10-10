const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.json");
const exportData = require("./helpers/exportData");
const {createGridFromBlock} = require("./helpers/createGrid")

const block = {
    x: 8,
    y: 23,
    w: 4,
    h: 4,
    children: [
      { x: 8, y: 23, w: 4, h: 2 },
      { x: 10, y: 25, w: 2, h: 2 }
    ],
}

// createGrid now takes in binary matrix of grids and populates them accordingly

const grid =  createGridFromBlock(block, Object.keys(table))
// preProcessGrid -> collapses tiles appropriately 
execWFC(table, grid, g => {
  exportData("./preview/map.json", g)
}).then(resultGrid => {
  // exportData("./preview/map.json", resultGrid)
})