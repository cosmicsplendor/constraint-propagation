const collapseCell = require("./collapseCell");
const findLowestEntropyCell = require("./findLowestEntropyCell");
const propagateConstraints = require("./propagateConstraints");
const waitForKeyPress = require("./waitForKeyPress");
function isFullyCollapsed(grid) {
    return grid.every(row => row.every(cell => {
        if (cell.type === "semi_collapsed") return false
        return cell.length === 1 || cell.length === 0
    }));
}
async function execWFC(table, grid, exportGrid) {
    while (!isFullyCollapsed(grid)) {
        const { row, col } = findLowestEntropyCell(grid);
        collapseCell(grid, row, col);
        propagateConstraints(table, grid, row, col);
        await waitForKeyPress()
        require("fs").writeFileSync("./preview-grid.json", JSON.stringify(grid[3][3], undefined, 3))
        exportGrid(grid)
    }
    return grid
}

module.exports = execWFC