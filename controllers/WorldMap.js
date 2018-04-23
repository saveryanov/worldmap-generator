var controllers = require('../controllers'),
    initArray = require('init-array');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;
var TileType = controllers.TileType;
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
    this.map = initArray([this.size.height, this.size.width, this.size.depth], TYPE_UNRESOLVED);
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

WorldmapGenerator.prototype.getRandomTileName = function (frequencies) {
    if (frequencies === undefined || Object.keys(frequencies) == 0) {
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
        currentProbabillity += frequencies[tileTypeName]/normalizationCoef;
        if (randomBaseVal < currentProbabillity) {
            return tileTypeName;
        }
    }

    return Object.keys(frequencies)[0];
}

WorldmapGenerator.prototype.getRandomTile = function (frequencies) {
    let randomTileName = this.getRandomTileName(frequencies);
    return this.tileTypes[randomTileName];
}

WorldmapGenerator.prototype.generate = function () {
    for (let z = 0; z < this.size.height; z++) {
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.depth; y++) {
                
                this.map[z][x][y] = this.getRandomTile();
            }
        }
    }
}

module.exports = WorldmapGenerator;