var controllers = require('../controllers');

const TYPE_UNRESOLVED = controllers.constants.typeUnresolved;

module.exports.validators = {
    isValidDimension: function (dimension) {
        return dimension && dimension > 0;
    },
    isValidTileName: function (name) {
        return name != TYPE_UNRESOLVED;
    }
}
