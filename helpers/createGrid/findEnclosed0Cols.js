function findEnclosed0Cols(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // To store the visited cells
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const regions = []; // To store regions of zeros

    // Directions for moving in 4-connected cells (up, down, left, right)
    const directions = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0]  // Up
    ];

    // Helper function to perform DFS
    function dfs(row, col, currentRegion) {
        // Mark this cell as visited and add it to the current region
        visited[row][col] = true;
        currentRegion.push([row, col]);
    
        // Check all 4 directions
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
    
            // If any neighbor is out of bounds, clear the current region and return
            if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
                currentRegion.length = 0;  // Empty out currentRegion
                return;
            }
    
            // Continue DFS if the new cell is within bounds, is a zero, and hasn't been visited
            if (
                grid[newRow][newCol] === 0 &&
                !visited[newRow][newCol]
            ) {
                dfs(newRow, newCol, currentRegion);
            }
        }
    }
    

    // Main loop to traverse the grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === 0 && !visited[row][col]) {
                // Start a new region
                const currentRegion = [];
                dfs(row, col, currentRegion);
                regions.push(currentRegion); // Save this region of zeros
            }
        }
    }

    return regions.filter(r => r.length > 0).map(getColumns).flat()
}
function getColumns(regions) {
    const group = {}
    regions.forEach(r => {
        group[r[1]] = group[r[1]] ?? []
        group[r[1]].push(r)
    })
    const result = Object.values(group)
    result.forEach(cells => {
        cells.sort((c1, c2) => c1[0] - c2[0])
    })
    return result.map(cols => {
        return { row: cols[0][0], col: cols[0][1], height: cols.length }
    })
}

module.exports = findEnclosed0Cols