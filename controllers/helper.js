var controllers = require('../controllers');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;

module.exports.validators = {
    isValidDimension: function (dimension) {
        return dimension && dimension > 0;
    },
    isValidTileName: function (name) {
        return (typeof name == 'string' && name) || typeof name == 'number';
    },
    isReservedTileName: function (name) {
        return [TYPE_UNRESOLVED].indexOf(name) == -1;
    }
}

module.exports.shuffle = function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}