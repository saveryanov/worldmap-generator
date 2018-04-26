var controllers = require('../controllers');

var validators = controllers.helper.validators;


class TileType {
    constructor({
        name,
        connections = {}
    } = {}) {
        if (!validators.isValidTileName(name)) {
            throw new Error(`Can't create tile type: "${name}" is not valid name of tile type`);
        }
        if (!validators.isReservedTileName(name)) {
            throw new Error(`Can't create tile type: "${name}" is a reserved name of tile type`);
        }

        this.name = name; // name of tile type
        
        this.connections = connections ? connections : {}; // init connections
    }
}

module.exports = TileType;