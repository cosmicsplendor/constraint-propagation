const getUndifferentiatedTiles = tiles => {
    const keys = Object.keys(tiles)
    return keys.map(key => ({ tile: key, weight: 1 / keys.length}))
}

const getGrid = (gridWidth, gridHeight) => Array.from({ length: gridHeight }, () => 
    Array.from({ length: gridWidth }, () => getUndifferentiatedTiles)
)

module.exports = getGrid