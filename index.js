const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.json");
const exportData = require("./helpers/exportData");
const createGrid = require("./helpers/createGrid")

const grid =  createGrid(5, 5, Object.keys(table))

const resultGrid = execWFC(table, grid)
exportData("./preview/map.json", resultGrid)