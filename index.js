const collapseCell = require("./helpers/collapseCell");
const findLowestEntropyCell = require("./helpers/findLowestEntropyCell");
const createGrid = require("./helpers/createGrid");
const propagateConstraints = require("./helpers/propagateConstraints");

function runWFC(table, gridWidth, gridHeight) {
    const grid = createGrid(gridWidth, gridHeight)
    while (!isFullyCollapsed(grid)) {
        const { row, col } = findLowestEntropyCell(grid);
        collapseCell(grid, row, col);
        propagateConstraints(table, grid, row, col);
    }
}

function isFullyCollapsed(grid) {
    return grid.every(row => row.every(cell => cell.length === 1));
}
