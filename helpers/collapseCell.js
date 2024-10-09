function collapseCell(grid, row, col) {
    const possibleTiles = grid[row][col];
    const chosenTile = chooseTileWithWeight(possibleTiles);
    grid[row][col] = [chosenTile]; // Collapse to one tile
}

function chooseTileWithWeight(possibleTiles) {
    let rand = Math.random();  // Since the weights sum to 1, we can directly use this random value
    for (let i = 0; i < possibleTiles.length; i++) {
        rand -= possibleTiles[i].weight;  // Subtract the weight of the current tile
        if (rand <= 0) {
            return possibleTiles[i].tile;  // Return the tile when the cumulative weight exceeds the random value
        }
    }

    // Fallback in case of rounding issues (shouldn't normally happen since weights sum to 1)
    return possibleTiles[0].tile;
}

module.exports = collapseCell