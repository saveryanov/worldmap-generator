var controllers = require('../controllers');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;

class TileType {
    constructor({
        name,
        connections = {}
    } = {}) {
        if (name == TYPE_UNRESOLVED) {
            throw new Error(`Can't create tile type: "${TYPE_UNRESOLVED}" is a reserved name of tile type`);
        }

        this.name = name ? name : TYPE_UNRESOLVED;
        this.connections = {};
        this.connections.top = connections.top ? connections.top : [];
        this.connections.bottom = connections.bottom ? connections.bottom : [];
        this.connections.up = connections.up ? connections.up : [];
        this.connections.down = connections.down ? connections.down : [];
        this.connections.left = connections.left ? connections.left : [];
        this.connections.rigth = connections.rigth ? connections.rigth : [];
    }
}

module.exports = TileType;
