const getUndifferentiatedTiles = tiles => {
    const keys = Object.keys(tiles)
    return keys.map(key => ({ tile: key, weight: 1 / keys.length}))
}

const createGrid = (gridWidth, gridHeight, allTiles) => Array.from({ length: gridHeight }, () => 
    Array.from({ length: gridWidth }, () => getUndifferentiatedTiles(allTiles))
)

module.exports = createGrid