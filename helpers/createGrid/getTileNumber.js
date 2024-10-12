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
const getTileNumber = (grid, row, col) => {
    const tileType = getTileType(getConfig(grid, row, col));
    return tileTypeToNumber[tileType] || 0; // Returns 0 for "unknown" type
};

module.exports = getTileNumber