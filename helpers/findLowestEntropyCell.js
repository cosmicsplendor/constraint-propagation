function getCellEntropy(cell, edge) {
    if (cell.length === 0) return Infinity
    if (cell.length === 1 && typeof cell[0] === "string") return Infinity
    if (edge) return -100
    return cell.length; // The number of possible tiles for this cell
}
function findLowestEntropyCell(grid) {
    let minEntropy = Infinity;
    let selectedCell = null;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const entropy = grid[row][col].type === "semi_collapsed" ? -200: getCellEntropy(grid[row][col], grid.edgeMap[row][col]);
            if (entropy < minEntropy) {
                minEntropy = entropy;
                selectedCell = { row, col };
            }
        }
    }
    console.log(selectedCell)
    return selectedCell;
}

module.exports = findLowestEntropyCell