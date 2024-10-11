function createGridWithPostProcessing({ x, y, w, h, children }) {
    // Step 1: Determine the grid size after extending by 1 unit on all sides
    const gridHeight = h + 2;
    const gridWidth = w + 2;

    // Initialize the grid with null values
    let grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null));

    // Step 2: Fill the parent area with 0, extended by 1 unit
    for (let i = 1; i <= h; i++) {
        for (let j = 1; j <= w; j++) {
            grid[i][j] = 0;
        }
    }

    // Step 3: Fill the children areas with 1
    children.forEach(child => {
        for (let i = 0; i < child.h; i++) {
            for (let j = 0; j < child.w; j++) {
                const gridX = j + (child.x - x) + 1;  // adjust for extended padding
                const gridY = i + (child.y - y) + 1;
                grid[gridY][gridX] = 1;
            }
        }
    });

    // Step 4: Post processing step
    for (let curY = 0; curY < gridHeight; curY++) {
        for (let curX = 0; curX < gridWidth; curX++) {
            if (grid[curY][curX] === 1) {
                continue;  // Step 1: If the cell is 1, skip it
            }

            // Step 2: Scan along the row (horizontal scan)
            let deltaX = Infinity;
            for (let scanX = 0; scanX < gridWidth; scanX++) {
                if (grid[curY][scanX] === 1) {
                    deltaX = Math.min(deltaX, Math.abs(scanX - curX));
                }
            }

            // Step 2: Scan along the column (vertical scan)
            let deltaY = Infinity;
            for (let scanY = 0; scanY < gridHeight; scanY++) {
                if (grid[scanY][curX] === 1) {
                    deltaY = Math.min(deltaY, Math.abs(scanY - curY));
                }
            }

            // Step 3: If deltaX > 1 and deltaY > 1, set the current cell to null
            // This ensures we only set null if both deltas are greater than 1
            if (deltaX > 1 && deltaY > 1) {
                grid[curY][curX] = null;
            } else {
                grid[curY][curX] = 0;  // Extend cells that are near to 1
            }
        }
    }

    return grid;
}

const getUndifferentiatedTiles = tiles => {
    return tiles.map(key => ({ tile: key, weight: 1 / tiles.length }))
}

const createGrid = (gridWidth, gridHeight, allTiles) => Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => getUndifferentiatedTiles(allTiles))
)



module.exports = {
    createGrid,
    createGridFromBlock: (block, allTiles) => {
        const grid = createGridWithPostProcessing(block)
        grid.forEach(row => {
            console.log(row.map(v => v === null ? "n": v).join(" "))
        })
        const edgeMap = Array.from({ length: grid.length }, () => {
            return Array.from({ length: grid[0].length }, () => 0)
        })
        const isEdge = (row, col) => {
            return grid[row-1][col]==0 || grid[row][col-1]==0 || grid[row+1][col]==0 || grid[row][col+1]==0
        }
        grid.forEach((row, i) => {
            return row.forEach((cell, j) => {
                if (cell === null || cell === 0) return [ "empty" ]
                if (!isEdge(i, j)) return
                edgeMap[i][j] = 1
            })
        })
        return Object.assign(grid.map((row, i) => {
            return row.map((cell, j) => {
                if (cell === null) return [ "empty" ]
                if (cell === 0) return { type: "semi_collapsed", tile: "empty" }
                return getUndifferentiatedTiles(allTiles)
            })
        }), { edgeMap })
    }
}