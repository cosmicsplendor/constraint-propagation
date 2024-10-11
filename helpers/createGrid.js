const directions = [
    { name: 'topLeft', dx: -1, dy: -1 },
    { name: 'top', dx: -1, dy: 0 },
    { name: 'topRight', dx: -1, dy: 1 },
    { name: 'right', dx: 0, dy: 1 },
    { name: 'bottomRight', dx: 1, dy: 1 },
    { name: 'bottom', dx: 1, dy: 0 },
    { name: 'bottomLeft', dx: 1, dy: -1 },
    { name: 'left', dx: 0, dy: -1 }
]
const tileTypeToNumber = {
    "inside": 1,
    "bottom-left": 2,
    "bottom-right": 3,
    "right": 4,
    "left": 5,
    "top-right": 6,
    "top-left": 7,
    "bottom": 8,
    "top": 9,
    "bottom-left-seam": 10,
    "bottom-right-seam": 11,
    "top-left-seam": 12,
    "top-right-seam": 13
};
const getTileType = configuration => {
    const { topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left } = configuration

    // Corner tiles
    if (left === 0 && top === 0) return "top-left"
    if (right === 0 && top === 0) return "top-right"
    if (left === 0 && bottom === 0) return "bottom-left"
    if (right === 0 && bottom === 0) return "bottom-right"

    // Side tiles
    if (left === 0 && top === 1 && bottom === 1) return "left"
    if (right === 0 && top === 1 && bottom === 1) return "right"
    if (top === 0 && left === 1 && right === 1) return "top"
    if (bottom === 0 && left === 1 && right === 1) return "bottom"

    // Seam tiles (concave corners)
    if (bottomLeft === 0 && bottom === 1 && left === 1) return "bottom-left-seam"
    if (bottomRight === 0 && bottom === 1 && right === 1) return "bottom-right-seam"
    if (topLeft === 0 && top === 1 && left === 1) return "top-left-seam"
    if (topRight === 0 && top === 1 && right === 1) return "top-right-seam"

    // Inside tile
    if (topLeft === 1 && top === 1 && topRight === 1 && right === 1 && 
        bottomRight === 1 && bottom === 1 && bottomLeft === 1 && left === 1) return "inside"

    // Default case if no other conditions are met
    return "unknown"
}
function getConfig(grid, row, col) {
    const config = {};
    
    directions.forEach(dir => {
        const newRow = row + dir.dx;
        const newCol = col + dir.dy;
        
        // Check if the new position is within the grid bounds
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            config[dir.name] = grid[newRow][newCol];
        } else {
            config[dir.name] = 0; // Treat out-of-bounds as 0
        }
    });
    
    return config;
}
const getTileNumber = configuration => {
    const tileType = getTileType(configuration);
    return tileTypeToNumber[tileType] || 0; // Returns 0 for "unknown" type
};
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

    return expandedGrid;
}

const getUndifferentiatedTiles = tiles => {
    return tiles.map(key => ({ tile: key, weight: 1 / tiles.length }))
}

const createGrid = (block, allTiles) => {
    const grid = createPrereqGrid(block)
    return Array.from({ length: grid.length - 2 }, (_, j) => {
        return Array.from({ length: grid[0].length - 2 }, (_, i) => {
            if (grid[j + 1][i + 1] === 0) return ["empty"]
            const num = getTileNumber(getConfig(grid, j + 1, i + 1))
            if (num === 1) return getUndifferentiatedTiles(allTiles)
         
            return [`wt_${num}`]
        })
    })
}

module.exports = createGrid