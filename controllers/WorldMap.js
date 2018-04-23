var controllers = require('../controllers'),
    initArray = require('init-array');

var TileType = controllers.TileType;
var MapCell = controllers.MapCell;
var validators = controllers.helper.validators;

class WorldmapGenerator {
    constructor({
        size = {},
        tileTypes = []
    } = {}) {
        // init size params
        this.size = {};
        this.size.width = 10;
        this.size.depth = 10;
        this.size.height = 1; // just one layer
        this.setSize(size);

        // init tile types
        this.tileTypes = {};
        for (let tileType of tileTypes) {
            this.addTile(tileType);
        }

        // init map
        this.map = [];
        this.unresolvedCount = 0;
        this.initMap();
    }
}

WorldmapGenerator.prototype.initMap = function () {
    this.map = initArray([this.size.height, this.size.width, this.size.depth], null);
    
    for (let z = 0; z < this.size.height; z++) {
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.depth; y++) {
                this.map[z][x][y] = new MapCell();
            }
        }
    }

    this.unresolvedCount = this.size.height * this.size.width * this.size.depth;
}

WorldmapGenerator.prototype.setSize = function ({
    width,
    depth,
    height
} = {}) {
    if (width !== undefined) {
        this.size.width = validators.isValidDimension(width) ? width : 10;
    }
    if (depth !== undefined) {
        this.size.depth = validators.isValidDimension(depth) ? depth : 10;
    }
    if (height !== undefined) {
        this.size.height = validators.isValidDimension(height) > 0 ? height : 1;
    }
}

WorldmapGenerator.prototype.updateTileConnections = function () {
    for (let tileTypeName in this.tileTypes) {
        let tileType = this.tileTypes[tileTypeName];
        for (let sideName in tileType.connections) {
            for (let connectionName in tileType.connections[sideName]) {
                let frequency = tileType.connections[sideName][connectionName];
                if (this.tileTypes[connectionName]) {
                    this.tileTypes[connectionName].connections[controllers.helper.invertSide(sideName)][tileTypeName] = frequency;
                }
            }
        }
    }
}

WorldmapGenerator.prototype.addTile = function (params) {
    var tileType = new TileType(params);
    this.tileTypes[tileType.name] = tileType;
    this.updateTileConnections();
}

WorldmapGenerator.prototype.getRandomTileTypeName = function (frequencies = {}) {
    if (!frequencies || Object.keys(frequencies).length == 0) {
        frequencies = {};
        for (let tileTypeName in this.tileTypes) {
            frequencies[tileTypeName] = this.tileTypes[tileTypeName].frequency;
        }
    }

    var normalizationCoef = 0;
    for (let tileTypeName in frequencies) {
        normalizationCoef += frequencies[tileTypeName];
    }
    var randomBaseVal = Math.random();

    var currentProbabillity = 0;
    for (let tileTypeName in frequencies) {
        currentProbabillity += frequencies[tileTypeName] / normalizationCoef;
        if (randomBaseVal < currentProbabillity) {
            return tileTypeName;
        }
    }

    return Object.keys(frequencies)[0];
}

WorldmapGenerator.prototype.getRandomTileType = function (frequencies) {
    let randomTileName = this.getRandomTileTypeName(frequencies);
    return this.tileTypes[randomTileName];
}


WorldmapGenerator.prototype.getCellRaw = function (z, x, y) {
    if (this.map[z] && this.map[z][x] && this.map[z][x][y]) {
        return this.map[z][x][y];
    }

    return null;
}

WorldmapGenerator.prototype.getCell = function (z, x, y) {
    if (this.map[z] && this.map[z][x] && this.map[z][x][y]) {
        let cell = this.map[z][x][y];
        if (cell.frequencies === null && !cell.resolved) {
            cell.frequencies = {};
            for (let tileTypeName in this.tileTypes) {
                let tileType = this.tileTypes[tileTypeName];
                cell.frequencies[tileTypeName] = tileType.frequency;
            }
        }
        return cell;
    }
    return null;
}

WorldmapGenerator.prototype.updateSurroundFrequencies = function (z, x, y) {
    var self = this;
    function updateFrequencies(offset_z, offset_x, offset_y, tileTypeSideConnections) {
        if (tileTypeSideConnections) {
            for (let connectionName in tileTypeSideConnections) {
                let frequency = tileTypeSideConnections[connectionName];
                let cell = self.getCellRaw(z + offset_z, x + offset_x, y + offset_y);
                if (cell && !cell.resolved) {
                    if (!cell.frequencies) {
                        cell.frequencies = {};
                    }
                    if (cell.frequencies[connectionName] === undefined || frequency === 0) {
                        cell.frequencies[connectionName] = frequency;
                    }
                }
            }
        }
    }

    if (this.map[z] && this.map[z][x] && this.map[z][x][y]) {
        let tileTypeName = this.map[z][x][y].name;
        let tileType = this.tileTypes[tileTypeName];

        updateFrequencies(1, 0, 0, tileType.connections.top);
        updateFrequencies(-1, 0, 0, tileType.connections.bottom);
        updateFrequencies(0, -1, 0, tileType.connections.left);
        updateFrequencies(0, 1, 0, tileType.connections.right);
        updateFrequencies(0, 0, -1, tileType.connections.up);
        updateFrequencies(0, 0, 1, tileType.connections.down);
    }
}


WorldmapGenerator.prototype.resolveMapCell = function (z, x, y, name) {
    this.map[z][x][y].resolve(name);
    this.updateSurroundFrequencies(z, x, y);
}

WorldmapGenerator.prototype.generate = function () {
    var self = this;
    function getUnresolvedCoords() {
        var coords = [];
        for (let z = 0; z < self.size.height; z++) {
            for (let x = 0; x < self.size.width; x++) {
                for (let y = 0; y < self.size.depth; y++) {
                    let cell = self.getCell(z, x, y);
                    if (!cell.resolved) {
                        coords.push({x: x, y: y, z: z});
                    }
                }
            }
        }
        return coords;
    }

    // recursively creates map
    function processCell(z, x, y, callStackLeft = 10) {
        if (self.unresolvedCount <= 0) {
            return;
        }

        if (callStackLeft <= 0) {
            return;
        }

        let cell = self.getCell(z, x, y);
        if (!cell || cell.resolved) {
            return;
        }

        let currentTileType = self.getRandomTileType(cell.frequencies);
        self.resolveMapCell(z, x, y, currentTileType.name);
        self.unresolvedCount--;

        processCell(z + 1, x, y, callStackLeft - 1); // top
        processCell(z - 1, x, y, callStackLeft - 1); // bottom
        processCell(z, x - 1, y, callStackLeft - 1); // left
        processCell(z, x + 1, y, callStackLeft - 1); // right
        processCell(z, x, y - 1, callStackLeft - 1); // up
        processCell(z, x, y + 1, callStackLeft - 1); // down
        processCell(z, x - 1, y - 1, callStackLeft - 1); // up-left
        processCell(z, x + 1, y - 1, callStackLeft - 1); // up-right
        processCell(z, x - 1, y + 1, callStackLeft - 1); // down-left
        processCell(z, x + 1, y + 1, callStackLeft - 1); // down-right
    }

    while (self.unresolvedCount > 0) {
        let coords = getUnresolvedCoords();
        let {x, y, z} = coords[Math.floor(Math.random() * coords.length)];
        processCell(z, x, y);
        break;
    }
}

module.exports = WorldmapGenerator;