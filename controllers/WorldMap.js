var controllers = require('../controllers'),
    initArray = require('init-array');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;
var TileType = controllers.TileType;

class WorldmapGenerator {
    constructor({
        size = {},
        tileTypes = []
    } = {}) {
        // init params
        this.size = {};
        this.size.width = size.width ? size.width : 10;
        this.size.depth = size.depth ? size.depth : 10;
        this.size.height = size.height ? size.height : 1;
        
        // init tile types
        this.tileTypes = {};
        this.tileTypes[TYPE_UNRESOLVED] = new TileType();
        for (let tileType of tileTypes) {
            this.tileTypes[tileType.name] = new TileType(tileType)
        }

        // init map
        this.map = initArray([this.size.height, this.size.width, this.size.depth], 'unresolved');
    }
}

module.exports = WorldmapGenerator;
