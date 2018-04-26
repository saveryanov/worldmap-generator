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
        this.size.height = 10;
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
    this.map = initArray([this.size.width, this.size.height], null);
    
    for (let x = 0; x < this.size.width; x++) {
        for (let y = 0; y < this.size.height; y++) {
            this.map[x][y] = new MapCell();
        }
    }

    this.unresolvedCount = this.size.width * this.size.height;
}

WorldmapGenerator.prototype.setSize = function ({
    width,
    height
} = {}) {
    if (width !== undefined) {
        this.size.width = validators.isValidDimension(width) ? width : 10;
    }
    if (height !== undefined) {
        this.size.height = validators.isValidDimension(height) > 0 ? height : 10;
    }
}

WorldmapGenerator.prototype.updateTileConnections = function () {
    // create inverted connections
    for (let tileTypeName in this.tileTypes) {
        let tileType = this.tileTypes[tileTypeName];
        for (let connectionName in tileType.connections) {
            let frequency = tileType.connections[connectionName];
            if (this.tileTypes[connectionName] && this.tileTypes[connectionName].connections[tileTypeName] === undefined) {
                this.tileTypes[connectionName].connections[tileTypeName] = frequency;
            }
        }
    }
    // create undefined connections
    for (let tileTypeNameOuter in this.tileTypes) {
        for (let tileTypeName in this.tileTypes) {
            let tileType = this.tileTypes[tileTypeName];
            if (tileType.connections[tileTypeNameOuter] === undefined) {
                tileType.connections[tileTypeNameOuter] = 0;
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
    if (normalizationCoef <= 0) {
        normalizationCoef = 1;
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
    if (randomTileName && this.tileTypes[randomTileName]) {
        return this.tileTypes[randomTileName];
    } else {
        return null;
    }
}


WorldmapGenerator.prototype.getCell = function (x, y) {
    if (this.map[x] && this.map[x][y]) {
        return this.map[x][y];
    }
    return null;
}

WorldmapGenerator.prototype.updateSurroundFrequencies = function (x, y) {
    var self = this;
    function updateFrequencies(offset_x, offset_y, tileTypeSideConnections) {
        if (tileTypeSideConnections) {
            for (let connectionName in tileTypeSideConnections) {
                let frequency = tileTypeSideConnections[connectionName];

                let cell = self.getCell(x + offset_x, y + offset_y);
                if (cell && !cell.resolved) {
                    if (!cell.frequencies) {
                        cell.frequencies = {};
                    }
                    if (frequency === 0) {
                        cell.frequencies[connectionName] = frequency;
                    } else if (cell.frequencies[connectionName] !== 0) {
                        if (cell.frequencies[connectionName] === undefined) {
                            cell.frequencies[connectionName] = frequency;
                        } else {
                            cell.frequencies[connectionName] += frequency;
                        }
                    }
                }
            }
        }
    }

    if (this.map[x] && this.map[x][y]) {
        let tileTypeName = this.map[x][y].name;
        let tileType = this.tileTypes[tileTypeName];

        updateFrequencies(-1, 0, tileType.connections);
        updateFrequencies(1, 0, tileType.connections);
        updateFrequencies(0, -1, tileType.connections);
        updateFrequencies(0, 1, tileType.connections);
    }
}


WorldmapGenerator.prototype.resolveMapCell = function (x, y, name) {
    this.map[x][y].resolve(name);
    this.unresolvedCount--;
    this.updateSurroundFrequencies(x, y);
}

WorldmapGenerator.prototype.getInitialFrequencies = function() {
    var frequencies = {};
    for (let tileTypeName in this.tileTypes) {
        frequencies[tileTypeName] = 1;
    }
    return frequencies;
}

WorldmapGenerator.prototype.generate = function () {
    var self = this;

    function getUnresolvedCoords() {
        var coords = [];
        for (let x = 0; x < self.size.width; x++) {
            for (let y = 0; y < self.size.height; y++) {
                let cell = self.getCell(x, y);
                if (!cell.resolved) {
                    coords.push({x: x, y: y});
                }
            }
        }
        return coords;
    }


    // recursively creates map
    function clearCells({x, y, callStackLeft = 25} = {}) {
        if (callStackLeft < 0) {
            return;
        }
        
        let cell = self.getCell(x, y);
        if (!cell) {
            return;
        }
        cell.clear();
        this.updateSurroundFrequencies(x, y);
        self.unresolvedCount++;

        controllers.helper.shuffle([
            {x: x - 1, y: y, callStackLeft: callStackLeft - 1}, // left
            {x: x + 1, y: y, callStackLeft: callStackLeft - 1}, // right
            {x: x, y: y - 1, callStackLeft: callStackLeft - 1}, // up
            {x: x, y: y + 1, callStackLeft: callStackLeft - 1}, // down
        ]).map(clearCells);
    }

    // recursively creates map
    function processCell({x, y, callStackLeft = 200} = {}) {
        if (self.unresolvedCount <= 0) {
            return;
        }

        if (callStackLeft < 0) {
            return;
        }

        let cell = self.getCell(x, y);
        if (!cell || cell.resolved) {
            return;
        }
        
        var frequencies = Object.keys(cell.frequencies).length ? cell.frequencies : self.getInitialFrequencies();

        let currentTileType = self.getRandomTileType(frequencies);
        if (currentTileType == null) {  // if unresolvable cell
            clearCells(x, y);    // fall back
            return;
        }
        self.resolveMapCell(x, y, currentTileType.name);

        controllers.helper.shuffle([
            {x: x - 1, y: y, callStackLeft: callStackLeft - 1}, // left
            {x: x + 1, y: y, callStackLeft: callStackLeft - 1}, // right
            {x: x, y: y - 1, callStackLeft: callStackLeft - 1}, // up
            {x: x, y: y + 1, callStackLeft: callStackLeft - 1}, // down
        ]).map(processCell);

    }

    let coords = getUnresolvedCoords();
    while (coords.length) {
        processCell(coords[Math.floor(Math.random() * coords.length)]);
        coords = getUnresolvedCoords();
    }
}

module.exports = WorldmapGenerator;