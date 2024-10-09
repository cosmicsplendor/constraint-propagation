const getUndifferentiatedTiles = tiles => {
    return tiles.map(key => ({ tile: key, weight: 1 / tiles.length}))
}

const createGrid = (gridWidth, gridHeight, allTiles) => Array.from({ length: gridHeight }, () => 
    Array.from({ length: gridWidth }, () => getUndifferentiatedTiles(allTiles))
)

module.exports = createGrid