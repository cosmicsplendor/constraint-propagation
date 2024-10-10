const collapseCell = require("./collapseCell");
const findLowestEntropyCell = require("./findLowestEntropyCell");
const createGrid = require("./createGrid");
const propagateConstraints = require("./propagateConstraints");
function isFullyCollapsed(grid) {
    return grid.every(row => row.every(cell => cell.length === 1 || cell.length === 0));
}

function execWFC(table, grid) {
    while (!isFullyCollapsed(grid)) {
        const { row, col } = findLowestEntropyCell(grid);
        collapseCell(grid, row, col);
        propagateConstraints(table, grid, row, col);
    }
    return grid
}

module.exports = execWFC