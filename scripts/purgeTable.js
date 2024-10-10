const adjacencyTable = require("../adjacencyTable.json")
const purge = require("./purge.json")

// purge forking relationships
Object.keys(purge).forEach(key => {
    const tile = `wt_${key}`
    const tilesToPurge = purge[key].map(n => `wt_${n}`)
    Object.values(adjacencyTable[tile]).forEach(val => {
        const index = val.findIndex(data => tilesToPurge.includes(data.tile))
        if (index === -1) return
        const [{ weight, tile }] = val.splice(index, 1)
        val.forEach(d => {
            d+=weight/val.length
        })
        val.push({ tile, weight: 0 })
        const sum = val.reduce((sum, v) => v.weight + sum, 0)
        val.forEach(d => {
            d.weight /= sum
        })
        console.log(val.reduce((sum, v) => v.weight + sum, 0))
    })
})
require("fs").writeFileSync("./adjacency.json", JSON.stringify(adjacencyTable))