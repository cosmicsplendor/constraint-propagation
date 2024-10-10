const collapseCell = require("./collapseCell");
const findLowestEntropyCell = require("./findLowestEntropyCell");
const propagateConstraints = require("./propagateConstraints");
function isFullyCollapsed(grid) {
    return grid.every(row => row.every(cell => {
        if (cell.type === "semi_collapsed") return false
        return cell.length === 1 || cell.length === 0
    }));
}
const wait = t => new Promise(resolve => setTimeout(resolve, t * 1000))
async function execWFC(table, grid, exportGrid) {
    while (!isFullyCollapsed(grid)) {
        const { row, col } = findLowestEntropyCell(grid);
        collapseCell(grid, row, col);
        propagateConstraints(table, grid, row, col);
        exportGrid(grid)
        await wait(1.5)
    }
    return grid
}

module.exports = execWFC