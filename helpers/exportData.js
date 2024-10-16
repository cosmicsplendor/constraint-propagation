const fs = require("fs")

const exportData = (path, grid) => {
    fs.writeFileSync(path, JSON.stringify(grid))
}

module.exports = exportData