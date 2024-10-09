
const adjOffsets = [
    { dir: "up", offset: [ -1, 0 ] },
    { dir: "down", offset: [ 1, 0 ] },
    { dir: "left", offset: [ 0, -1 ]},
    { dir: "right", offset: [ 0, 1 ] }
]

function propagate(grid, row, col) {
    const tile = grid[row][col][0]; // The collapsed tile

    adjOffsets.forEach(({ dir, offset }) => {
        const [dx, dy] = offset;
        const adjRow = row + dx;
        const adjCol = col + dy;

        if (!isInBounds(adjRow, adjCol)) return
        const validTiles = tiles[tile][dir];
        const validTileNames = validTiles.map(t => t.tile)

        // Restrict the neighbor's possible tiles to only the valid ones
        grid[adjRow][adjCol] = grid[adjRow][adjCol]
            .filter(t => validTileNames.includes(t.tile))
        // update weights
        grid[adjRow][adjCol].forEach(curTile => {
            const dw = validTiles.find(t => t.tile === curTile.tile).weight
            curTile.weight += dw
        })
        // normalize weights
        normalizeWeights(grid[adjRow][adjCol])
    });
}

function normalizeWeights(tiles) { // mutates the tiles array
    const sum = tiles.reduce((sum, tile) => sum + tile.width, 0)
    tiles.forEach(tile => {
        tile.weight /= sum
    })
}

function isInBounds(row, col) {
    return row >= 0 && row < gridHeight && col >= 0 && col < gridWidth;
}
