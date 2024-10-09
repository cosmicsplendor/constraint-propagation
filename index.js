const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.json");
const exportData = require("./helpers/exportData");
const grid = execWFC(table, 4, 4)
exportData("./test.json", grid)