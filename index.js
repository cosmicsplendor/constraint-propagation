const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.js");
const exportData = require("./helpers/exportData");
const createGrid = require("./helpers/createGrid")

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
const block1 = {
  x: 0,
  y: 0,
  w: 5,
  h: 5,
  children: [
    {x: 0, y:0, w: 5, h: 2},
    {x: 2, y:2, w:2, h: 2},
  ]
}
const block2 = {
  x: 0,
  y: 0,
  w: 5,
  h: 5,
  children: [
    {x: 0, y:0, w:5, h: 5},
  ]
}

const grid =  createGrid(block2, Object.keys(table))
execWFC(table, grid, g => {
  exportData("./preview/map.json", g)
})