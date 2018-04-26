var controllers = require('../controllers');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;

class MapCell {
    constructor(name = TYPE_UNRESOLVED) {
        this.name = name; // name of tile type
        this.resolved = false;
        this.frequencies = {};
    }
}

MapCell.prototype.clear = function() {
    this.name = TYPE_UNRESOLVED;
    this.resolved = false;
    this.frequencies = {};
}

MapCell.prototype.resolve = function(name) {
    this.name = name;
    this.resolved = true;
    this.frequencies = {};
}

MapCell.prototype.addFrequency = function({
    name,
    frequency = 1
} = {}) {
    this.frequencies[name] = frequency;
}

module.exports = MapCell;