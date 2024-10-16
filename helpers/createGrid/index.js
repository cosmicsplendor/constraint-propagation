const getTileNumber = require("./getTileNumber")
const hollowOutGrid = require("./hollowOutGrid")

function createPrereqGrid(data) {
    // Define the grid dimensions
    const gridHeight = data.h + 2 // Height of the main area plus 1 unit top and bottom
    const gridWidth = data.w + 2  // Width of the main area plus 1 unit left and right
    const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0))

    // Mark the main rectangle (at offset (1, 1))
    for (let i = 1; i <= data.h; i++) {
        for (let j = 1; j <= data.w; j++) {
            grid[i][j] = 1
        }
    }

    // Mark the children rectangles with the same offset
    data.children.forEach(child => {
        for (let i = child.y - data.y + 1; i < child.y - data.y + child.h + 1; i++) {
            for (let j = child.x - data.x + 1; j < child.x - data.x + child.w + 1; j++) {
                grid[i][j] = 1
            }
        }
    });

    // Create a new grid for the expanded area
    const expandedGrid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(1)); // Start with all cells set to 1
    // Expand the marked areas by 1 unit on all sides
    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            if (grid[i][j] === 1) {
                // Set the current cell and surrounding cells to 0 in the expanded grid
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        const ni = i + di;
                        const nj = j + dj;
                        if (ni >= 0 && ni < gridHeight && nj >= 0 && nj < gridWidth) {
                            expandedGrid[ni][nj] = 0;
                        }
                    }
                }
            }
        }
    }

    // Restore the bounded areas marked by children rectangles to 1
    data.children.forEach(child => {
        for (let i = child.y - data.y + 1; i < child.y - data.y + child.h + 1; i++) {
            for (let j = child.x - data.x + 1; j < child.x - data.x + child.w + 1; j++) {
                expandedGrid[i][j] = 1;
            }
        }
    });
    return hollowOutGrid(expandedGrid);
}

const getUndifferentiatedTiles = tiles => {
    return tiles.map(key => ({ tile: key, weight: 1 / tiles.length }))
}

const createGrid = (block, allTiles) => {
    const grid = createPrereqGrid(block)
    return Array.from({ length: grid.length - 2 }, (_, j) => {
        return Array.from({ length: grid[0].length - 2 }, (_, i) => {
            if (grid[j + 1][i + 1] === 0) return ["empty"]
            const num = getTileNumber(grid, j + 1, i + 1)
            if (num === 1) return getUndifferentiatedTiles(allTiles)
            return { type: "semi_collapsed", tile: `wt_${num}` }
        })
    })
}

module.exports = createGrid