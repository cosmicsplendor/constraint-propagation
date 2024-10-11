function collapseCell(grid, row, col) {
    const tilesOrSemicollapsedTile = grid[row][col];
    const semicollapsed = tilesOrSemicollapsedTile.type === "semi_collapsed"
    const chosenTile = semicollapsed ? tilesOrSemicollapsedTile.tile: chooseTileWithWeight(tilesOrSemicollapsedTile);
    grid[row][col] = [chosenTile]; // Collapse to one tile
}

function chooseTileWithWeight(possibleTiles) {
    let rand = Math.random();  // Since the weights sum to 1, we can directly use this random value
    for (let i = 0; i < possibleTiles.length; i++) {
        const curTile = possibleTiles[i]
        rand -= curTile.weight;  // Subtract the weight of the current tile
        if (rand <= 0) {
            // if (curTile.weight === 0) break
            return curTile.tile;  // Return the tile when the cumulative weight exceeds the random value
        }
    }
    // Fallback in case of rounding issues (shouldn't normally happen since weights sum to 1)
    return possibleTiles[0].tile;
}

module.exports = collapseCell