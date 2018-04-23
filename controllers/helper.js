var controllers = require('../controllers');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;
const TYPE_ANY = controllers.constants.typeAny;
const TYPE_EMPTY = controllers.constants.typeEmpty;

module.exports.validators = {
    isValidDimension: function (dimension) {
        return dimension && dimension > 0;
    },
    isValidTileName: function (name) {
        return (typeof name == 'string' && name) || typeof name == 'number';
    },
    isReservedTileName: function (name) {
        return [TYPE_UNRESOLVED, TYPE_ANY, TYPE_EMPTY].indexOf(name) == -1;
    }
}

module.exports.invertSide = function (sideName) {
    switch (sideName) {
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        default:
            throw new Error(`Unsupported side ${sideName} for tile connection`);
    }
}