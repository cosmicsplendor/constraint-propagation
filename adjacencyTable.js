const HIGH = 3
const LOW = 1
const MEDIUM = 2
const inverseDir = {
    "up": "down",
    "down": "up",
    "left": "right",
    "right": "left"
}
const exclusiveMap = {
    "up": ["down", "left", "right"],
    "down": ["up", "left", "right"],
    "left": ["up", "down", "right"],
    "right": ["up", "down", "left"]
};
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
    set(dir, srcTile, targetTiles, weight=MEDIUM, reverseWeight=weight) {
        const possibleTiles = this.get(srcTile, dir)
        targetTiles = Array.isArray(targetTiles) ? targetTiles: [targetTiles]
        targetTiles.forEach(tile => {
            possibleTiles.push({ tile, weight })
            if (tile === srcTile) return
            this.get(tile, inverseDir[dir]).push({ tile: srcTile, weight: reverseWeight })
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
    up({ tile, tiles, weight, reverseWeight }) {
        this.set("up", tile, tiles, weight, reverseWeight)
    }
    down({ tile, tiles, weight, reverseWeight }) {
        this.set("down", tile, tiles, weight, reverseWeight)
    }
    left({ tile, tiles, weight, reverseWeight }) {
        this.set("left", tile, tiles, weight, reverseWeight)
    }
    right({ tile, tiles, weight, reverseWeight }) {
        this.set("right", tile, tiles, weight, reverseWeight)
    }
    all(props) {
        this.up(props)
        this.down(props)
        this.left(props)
        this.right(props)
    }
    exclusive({ tile, tiles, weight, reverseWeight, excludeDir }) {
        exclusiveMap[excludeDir].forEach(dir => {
            this.set(dir, tile, tiles, weight, reverseWeight);
        });
    }
    downExclusive(props) {
        this.exclusive({ ...props, excludeDir: 'down' });
    }

    upExclusive(props) {
        this.exclusive({ ...props, excludeDir: 'up' });
    }

    leftExclusive(props) {
        this.exclusive({ ...props, excludeDir: 'left' });
    }

    rightExclusive(props) {
        this.exclusive({ ...props, excludeDir: 'right' });
    }
    sides(props) {
        this.left(props)
        this.right(props)
    }
    export() {
        require("fs").writeFileSync("./adjacency.json", JSON.stringify(this.normalizeWeights().table))
    }
}

const adjacency = new Adjacency()
const engravings = ["en1", "en2", "en6", "en8", "dml5", "dml6"]
// const  backwalls = ["bw4", "bw5", "bw6", "bw7"]
const backwallsDown = ["bw12", "bw13", "bw2", "bw10"]

// generic wall tile
adjacency.all({ tile: "wt_1", tiles: "wt_1", weight: HIGH * 100 })
adjacency.downExclusive({ tile: "wt_1", tiles: engravings, weight: LOW / 5, reverseWeight: MEDIUM })
adjacency.all({ tile: "wt_1", tiles: [ "en4", "en5", "en7", "en10", "win1" ], weight: HIGH, reverseWeight: MEDIUM * 10})
adjacency.downExclusive({ tile: "wt_1", tiles: backwallsDown, weight: LOW/200, reverseWeight: MEDIUM * 10 })

// window
adjacency.all({ tile: "win1", tiles: ["en4"], weight: HIGH })
adjacency.down({ tile: "win1", tiles: ["en7"], weight: HIGH })
adjacency.all({ tile: "win1", tiles: ["en10", ...engravings ], weight: LOW / 2})

adjacency.downExclusive({ tile: "win2", tiles: ["wt_1"], weight: MEDIUM, reverseWeight: LOW })
adjacency.downExclusive({ tile: "win2", tiles: ["en4", "en5", "en7", "en10"], weight: MEDIUM, reverseWeight: HIGH * 2 })

// upside down tetris bricks
adjacency.up({ tile: "en4", tiles: ["en7"], weight: HIGH })
adjacency.down({ tile: "en4", tiles: ["en7"], weight: HIGH }) 
adjacency.sides({ tile: "en4", tiles: ["en7"], weight: LOW })
adjacency.sides({ tile: "en4", tiles: ["en10", "bw5", "bw7"], weight: LOW })
adjacency.all({ tile: "en7", tiles: ["en10", "bw5", "bw7"], weight: LOW })

backwallsDown.forEach(bwd => {
    adjacency.sides({ tile: bwd, tiles: backwallsDown, weight: LOW / 10, reverseWeight: LOW / 10})
})
adjacency.down({ tile: backwallsDown[0], tiles: backwallsDown[1], weight: MEDIUM, reverseWeight: MEDIUM })

// wall tile bottom seam
adjacency.downExclusive({ tile: "dml10", tiles: [ "wt_1" ], reverseWeight: HIGH, weight: HIGH})
adjacency.down({ tile: "dml10", tiles: backwallsDown, weight: MEDIUM, reverseWeight: HIGH * 2  })
adjacency.sides({ tile: "dml10", tiles: ["dml10"], weight: HIGH * 100 })
adjacency.normalizeWeights()
adjacency.export()
module.exports = adjacency.table