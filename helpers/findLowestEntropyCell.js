function getCellEntropy(cell) {
    if (cell.length === 1 || cell.length === 0) return Infinity
    return cell.length; // The number of possible tiles for this cell
}

function findLowestEntropyCell(grid) {
    let minEntropy = Infinity;
    let selectedCell = null;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const entropy = getCellEntropy(grid[row][col]);
            if (entropy < minEntropy) {
                minEntropy = entropy;
                selectedCell = { row, col };
            }
        }
    }

    return selectedCell;
}

module.exports = findLowestEntropyCell