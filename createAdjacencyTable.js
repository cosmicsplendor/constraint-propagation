const wallTileEquivalents = [
    "en1", "en2", "en4", "en5", "en6", "en7", "en8", "en9", "bw1", "dml5", "dml6", "wt_1", "win1"
]
const inverseDir = {
    "up": "down",
    "down": "up",
    "left": "right",
    "right": "left"
}
class Adjacency {
    table = {}
    get(tile, dir) {
        if (!this.table[tile]) {
            this.table[tile] = {
                up: [], down: [], left: [], right: []
            }
        }
        return this.table[tile][dir]
    }
    set(dir, srcTile, targetTiles, weight=1) {
        const possibleTiles = this.get(srcTile, dir)
        targetTiles = Array.isArray(targetTiles) ? targetTiles: [targetTiles]
        targetTiles.forEach(tile => {
            if (tile === srcTile) return
            possibleTiles.push({ tile, weight })
            this.get(tile, inverseDir[dir]).push({ tile, weight })
        })
    }
    normalizeWeights() {
        Object.values(this.table).forEach(data => {
            Object.values(data).forEach(dirData => {
                const sum = dirData.reduce((acc, x) => acc + x.weight, 0)
                for (let i = 0; i < dirData.length; i++) {
                    dirData[i].weight  /= sum
                }
            })
        })
        return this
    }
    up({ tile, tiles, weight }) {
        this.set("up", tile, tiles, weight)
    }
    down({ tile, tiles, weight }) {
        this.set("down", tile, tiles, weight)
    }
    left({ tile, tiles, weight }) {
        this.set("left", tile, tiles, weight)
    }
    right({ tile, tiles, weight }) {
        this.set("right", tile, tiles, weight)
    }
}
const adjacency = new Adjacency()