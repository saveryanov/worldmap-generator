var controllers = require('../controllers');

const SIDES = ['top', 'bottom', 'left', 'right', 'up', 'down'];
var validators = controllers.helper.validators;


class TileType {
    constructor({
        name,
        frequency = 1,
        connections = {}
    } = {}) {
        if (!validators.isValidTileName(name)) {
            throw new Error(`Can't create tile type: "${name}" is not valid name of tile type`);
        }
        if (!validators.isReservedTileName(name)) {
            throw new Error(`Can't create tile type: "${name}" is a reserved name of tile type`);
        }

        this.name = name; // name of tile type
        this.frequency = typeof frequency == 'number' ? frequency : 1;

        this.connections = {}; // init connections
        for (let sideName of SIDES) { // for each side
            this.connections[sideName] = connections[sideName] ? connections[sideName] : {};
        }
    }
}

module.exports = TileType;