const fs = require("fs")
const sanitizeGrid = grid => {
    return grid.map(row => {
        return row.map(cell => {
            if (!Array.isArray(cell) || cell.length > 1) return null
            if (cell.length === 0) return "empty"
            return typeof cell[0] === "string" ? cell[0]: cell[0].tile
        })
    })
}
const exportData = (path, grid) => {
    fs.writeFileSync(path, JSON.stringify(sanitizeGrid(grid)))
}

module.exports = exportData