const adjacencyTable = require("../adjacencyTable.json")
const valid = Array.from({ length: 13 }, (_, i) => {
    return `wt_${i+1}`
}).concat("empty")
// purge forking relationships
const newTable = Object.fromEntries(Object.entries(adjacencyTable).filter(([ key ]) => {
    return valid.includes(key)
}))

Object.values(newTable).forEach(data => {
    Object.keys(data).forEach(direction => {
        data[direction] = data[direction].filter(t => valid.includes(t.tile))
    })
})

require("fs").writeFileSync("./adjacency.json", JSON.stringify(newTable))
