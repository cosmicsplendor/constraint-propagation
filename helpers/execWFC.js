const collapseCell = require("./collapseCell");
const findLowestEntropyCell = require("./findLowestEntropyCell");
const propagateConstraints = require("./propagateConstraints");
const postprocessGrid = require("./createGrid/postprocessGrid")
const sanitizeGrid = require("./sanitizeGrid")
const waitForKeyPress = require("./waitForKeyPress");
function isFullyCollapsed(grid) {
    return grid.every(row => row.every(cell => {
        if (cell.type === "semi_collapsed") return false
        return (cell.length === 1 && typeof cell[0] === "string") || cell.length === 0
    }));
}
async function execWFC(table, grid, exportGrid) {
    while (!isFullyCollapsed(grid)) {
        const { row, col } = findLowestEntropyCell(grid);
        collapseCell(grid, row, col);
        propagateConstraints(table, grid, row, col);
        
        // await waitForKeyPress()
        // require("fs").writeFileSync("./preview-grid.json", JSON.stringify(grid, undefined, 3))
        // exportGrid(grid)
    }
    const finalGrid = postprocessGrid(sanitizeGrid(grid))
    exportGrid(finalGrid)
    return finalGrid
}

module.exports = execWFC