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
        this.up(props)
        this.down(props)
    }
    export() {
        require("fs").writeFileSync("./adjacency.json", JSON.stringify(this.normalizeWeights().table))
    }
}

const adjacency = new Adjacency()
const engravings = ["en1", "en2", "en6", "en8", "dml5", "dml6"]
const  backwalls = ["bw1", "bw3", "bw4", "bw5", "bw6", "bw7"]
const backwallsDown = ["bw2", "bw12", "bw13"]
const backwallsUp = "bw3"

// generic wall tile
adjacency.all({ tile: "wt_1", tiles: "wt_1", weight: HIGH * 200 })
adjacency.all({ tile: "wt_1", tiles: engravings.concat(backwalls), weight: LOW, reverseWeight: MEDIUM * 3 })
adjacency.all({ tile: "wt_1", tiles: [ "en4", "en5", "en7", "en10", "win1" ], weight: MEDIUM, reverseWeight: MEDIUM * 3})

adjacency.all({ tile: "wt_1", tiles: backwallsUp.concat(backwallsDown), weight: MEDIUM, reverseWeight: MEDIUM * 3 })

// window
adjacency.up({ tile: "win1", tiles: ["en4"], weight: HIGH })
adjacency.down({ tile: "win1", tiles: ["en7"], weight: HIGH })
adjacency.all({ tile: "win1", tiles: ["en10", ...engravings ], weight: LOW / 2})

// upside down tetris bricks
adjacency.up({ tile: "en4", tiles: ["en7"], weight: HIGH })
adjacency.down({ tile: "en4", tiles: ["en7"], weight: HIGH }) 
adjacency.sides({ tile: "en4", tiles: ["en7"], weight: LOW })
adjacency.sides({ tile: "en4", tiles: ["en10", "bw1", "bw5", "bw7"], weight: LOW })
adjacency.all({ tile: "en7", tiles: ["en10", "bw1", "bw5", "bw7"], weight: LOW })

// wall tile bottom seam
adjacency.downExclusive({ tile: "dml10", tiles: [ "wt_1" ], weight: MEDIUM * 3 })
adjacency.down({ tile: "dml10", tiles: backwallsDown, weight: MEDIUM })
adjacency.sides({ tile: "dml10", tiles: ["dml10"], weight: MEDIUM })

module.exports = adjacency.normalizeWeights().table