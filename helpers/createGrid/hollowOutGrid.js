function partialHollow(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const candidates = [];

    function isValid(x, y) {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }

    function getSurroundingSum(i, j) {
        let surrounding = [];
        for (let x = i - 2; x <= i + 2; x++) {
            for (let y = j - 2; y <= j + 2; y++) {
                if (isValid(x, y)) {
                    surrounding.push(grid[x][y]);
                }
            }
        }
        return surrounding.reduce((a, b) => a + b, 0);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                if (getSurroundingSum(i, j) === 25) {
                    candidates.push([i, j]);
                }
            }
        }
    }

    if (candidates.length === 0) {
        return [null, null];
    }

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    function findSubregion(i, j) {
        let left = j, right = j, top = i, bottom = i;

        while (left > 0 && grid[i][left - 1] === 1) left--;
        while (right < cols - 1 && grid[i][right + 1] === 1) right++;
        while (top > 0 && Array.from({ length: right - left + 1 }, (_, y) => grid[top - 1][left + y]).every(cell => cell === 1)) top--;
        while (bottom < rows - 1 && Array.from({ length: right - left + 1 }, (_, y) => grid[bottom + 1][left + y]).every(cell => cell === 1)) bottom++;

        return [top, left, bottom, right];
    }

    const subregion = findSubregion(...chosen);
    return hollowOutSubregion(grid, subregion)
}
function hollowOutSubregion(grid, subregion) {
    const [top, left, bottom, right] = subregion;

    // Create a deep copy of the grid to avoid modifying the original
    const newGrid = grid.map(row => [...row]);

    // Hollow out the inner cells of the subregion
    for (let i = top + 2; i < bottom - 1; i++) {
        for (let j = left + 2; j < right - 1; j++) {
            newGrid[i][j] = 0;
        }
    }

    return newGrid;
}

function fullHollow(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // Create a deep copy of the grid to avoid modifying the original
    const newGrid = grid.map(row => [...row]);

    function isValid(x, y) {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }

    function getSurroundingSum(i, j) {
        let sum = 0;
        for (let x = i - 2; x <= i + 2; x++) {
            for (let y = j - 2; y <= j + 2; y++) {
                if (isValid(x, y)) {
                    sum += grid[x][y];
                }
            }
        }
        return sum;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1 && getSurroundingSum(i, j) === 25) {
                newGrid[i][j] = 0;
            }
        }
    }

    return newGrid;
}

module.exports = grid => {
    if (Math.random() < 0.5) return fullHollow(grid)
    if (Math.random() < 0.5) partialHollow(grid)
    return grid
}