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
        this.size.width = validators.isValidDimension(size.width) ? size.width : 10;
        this.size.depth = validators.isValidDimension(size.depth) ? size.depth : 10;
        this.size.height = validators.isValidDimension(size.height) > 0 ? size.height : 1;   // just one layer

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
