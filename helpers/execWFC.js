const collapseCell = require("./collapseCell");
const findLowestEntropyCell = require("./findLowestEntropyCell");
const createGrid = require("./createGrid");
const propagateConstraints = require("./propagateConstraints");
function isFullyCollapsed(grid) {
    return grid.every(row => row.every(cell => cell.length === 1));
}

function execWFC(table, gridWidth, gridHeight) {
    const grid = createGrid(gridWidth, gridHeight)
    while (!isFullyCollapsed(grid)) {
        const { row, col } = findLowestEntropyCell(grid);
        collapseCell(grid, row, col);
        propagateConstraints(table, grid, row, col);
    }
    return grid
}

module.exports = execWFC