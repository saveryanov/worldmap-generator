var controllers = require('../controllers');

const SIDES = ['top', 'bottom', 'left', 'right', 'up', 'down'];
var validators = controllers.helper.validators;


class TileType {
    constructor({
        name,
        frequency = 1,
        connections = {},
        limits = {}
    } = {}) {
        if (!validators.isValidTileName(name)) {
            throw new Error(`Can't create tile type: "${name}" is not valid name of tile type`);
        }
        if (!validators.isReservedTileName(name)) {
            throw new Error(`Can't create tile type: "${name}" is a reserved name of tile type`);
        }

        this.name = name; // name of tile type
        
        this.limits = limits;
        this.limits.min = Object.assign({z: -1, x: -1, y: -1}, this.limits.min ? this.limits.min : {});
        this.limits.max = Object.assign({z: 999999999, x: 999999999, y: 999999999}, this.limits.max ? this.limits.max : {});
        
        this.frequency = typeof frequency == 'number' ? frequency : 1;

        this.connections = {}; // init connections
        for (let sideName of SIDES) { // for each side
            this.connections[sideName] = connections[sideName] ? connections[sideName] : {};
        }
    }
}

TileType.prototype.isInLimits = function(z, x, y) {
    // check limits
    if (
        z < this.limits.min.z ||
        z > this.limits.max.z ||
        x < this.limits.min.x ||
        x > this.limits.max.x ||
        y < this.limits.min.y ||
        y > this.limits.max.y
    ) {
        return false;
    }
    return true;
}

module.exports = TileType;