
const adjOffsets = [
    { dir: "up", offset: [ -1, 0 ] },
    { dir: "down", offset: [ 1, 0 ] },
    { dir: "left", offset: [ 0, -1 ]},
    { dir: "right", offset: [ 0, 1 ] }
]

function propagate(table, grid, row, col) {
    const tile = grid[row][col][0]; // The collapsed tile
    adjOffsets.forEach(({ dir, offset }) => {
        const [dx, dy] = offset;
        const adjRow = row + dx;
        const adjCol = col + dy;

        if (!isInBounds(adjRow, adjCol, grid)) return
        if (grid[adjRow][adjCol].length === 1) return
        if (grid[adjRow][adjCol].type === "semi_collapsed") return

        const validTiles = table[tile.startsWith("wt") ? "wt_1": tile][dir];
        const validTileNames = validTiles.map(t => t.tile)

        // Restrict the neighbor's possible tiles to only the valid ones
        grid[adjRow][adjCol] = grid[adjRow][adjCol]
            .filter(t => validTileNames.includes(t.tile))
        // update weights
        grid[adjRow][adjCol].forEach(curTile => {
            const dw = validTiles.find(t => t.tile === curTile.tile).weight
            curTile.weight += curTile.weight === 0 ? 0: dw
        })
        // normalize weights
        normalizeWeights(grid[adjRow][adjCol])
    });
}

function normalizeWeights(tiles) { // mutates the tiles array
    const sum = tiles.reduce((sum, tile) => sum + tile.weight, 0)
    tiles.forEach(tile => {
        tile.weight /= sum
    })
    tiles.sort((a, b) => b.weight - a.weight)
}

function isInBounds(row, col, grid) {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

module.exports = propagate