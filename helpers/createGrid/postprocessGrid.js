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
            console.log(cell)
            if (cell === "wt_9" && chance(1)) {
                let index = Math.floor(Math.random() * replacements_wt9.length);
                grid[row][col] = replacements_wt9[index];
            }

            // Rule 2: Replace wt_5 with wt_17 and the right cell with "empty"
            if (cell === "wt_5" && chance(0.075)) {
                if (col + 1 < grid[row].length && grid[row][col + 1] !== "empty") {
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
            if (cell === "wt_4" && chance(0.075)) {
                if (col - 1 >= 0 && grid[row][col - 1] !== "empty") {
                    grid[row][col - 1] = "wt_16";
                    grid[row][col] = "empty";
                }
            }
        }
    }

    return grid;
}

module.exports = postprocessGrid