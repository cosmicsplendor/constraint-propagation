const findEnclosed0Cols = require("./findEnclosed0Cols")
const edgeTiles = Array.from({ length: 16 }, (_, i) => `wt_${i + 2}`).concat("empty")
function postprocessGrid(grid) {
    // Helper to get random chance
    function chance(probability) {
        return Math.random() < probability;
    }

    // List of replacements for wt_9
    const replacements_wt9 = ["en11", "en15", "en14", "en12", "en16", "en13"];

    // Iterate through the grid
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            let cell = grid[row][col];

            // Rule 1: Replace wt_9 with one from replacements_wt9 based on chance
            if (cell === "wt_9" && chance(0.075)) {
                let index = Math.floor(Math.random() * replacements_wt9.length);
                grid[row][col] = replacements_wt9[index];
            }

            // Rule 2: Replace wt_5 with wt_17 and the right cell with "empty"
            if (cell === "wt_5" && chance(0.1)) {
                if (col + 1 < grid[row].length &&  !edgeTiles.includes(grid[row][col + 1])) {
                    grid[row][col] = "wt_17";
                    grid[row][col + 1] = "empty";
                }
            }

            // Rule 3: Replace wt_2 with wt_14 and the right cell with "empty"
            if (cell === "wt_2" && chance(0.1)) {
                if (col + 1 < grid[row].length && grid[row][col + 1] !== "empty") {
                    grid[row][col] = "wt_14";
                    grid[row][col + 1] = "empty";
                }
            }

            // Rule 4: Replace the left cell of wt_3 with wt_15 and itself with "empty"
            if (cell === "wt_3" && chance(0.1)) {
                if (col - 1 >= 0 && grid[row][col - 1] !== "empty") {
                    grid[row][col - 1] = "wt_15";
                    grid[row][col] = "empty";
                }
            }

            // Rule 5: Replace the left cell of wt_4 with wt_16 and itself with "empty"
            if (cell === "wt_4" && chance(0.1)) {
                if (col - 1 >= 0 && !edgeTiles.includes(grid[row][col - 1])) {
                    grid[row][col - 1] = "wt_16";
                    grid[row][col] = "empty";
                }
            }
        }
    }
    const topTiles = [ "bw13", "bw12", "bw2"]
    const bottomTile = "bw3"
    const middleTiles = ["bw1", "bw4", "bw5", "bw6", "bw5"]
    const pickOne = array => {
        return array[Math.floor(Math.random() * array.length)]
    }
    const getEnclosedTile = (i, maxI, height) => {
        if (i===0) {
            return Math.random() < 0.25 ? pickOne(topTiles): "bw2"
        }
        if (i===maxI-1 && maxI ===height) {
            return bottomTile
        }
        return (Math.random() < 0.4) ? pickOne(middleTiles): "bw1"
    }
    const sanitizedGrid = grid.map((row, j) => {
        return row.map((cell, i) => {
            const left = grid[j][i-1]
            const right = grid[j][i+1]
            const top = grid[j-1] && grid[j-1][i]
            const bottom = grid[j+1] && grid[j+1][i]
            if ([left, right, top, bottom].every(cell => cell !== "empty")) {
                if (top === "wt_8") return 0
                return 1
            }
            return cell === "empty" ? 0: 1
        })
    })
    findEnclosed0Cols(sanitizedGrid).forEach(({ row, col, height: h}) => {
        const rand = Math.random()
        const height = Math.ceil((1 - rand * rand) * h)
        for (let i = 0; i < height; i++) {
            const tile = getEnclosedTile(i, height, h)
            grid[row+i][col] = tile
        }
        if (height < h) {
            grid[row+height][col] = "bw10"
        }
    })
    return grid;
}

module.exports = postprocessGrid