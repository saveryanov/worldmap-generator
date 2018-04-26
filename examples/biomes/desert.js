/*
 * Usage example file
 */

var WorldmapGenerator = require('../../index'),
    helper = require('../examples_helper'),
    co = require('co');

const WIDTH = 500;
const HEIGHT = 500;

var filename = __dirname + '/desert.png';

co(function* () {

    console.time("Generator inited");
    var world = new WorldmapGenerator({
        size: {
            width: WIDTH,
            height: HEIGHT
        },
        tileTypes: [
            {
                name: 'sand',
                connections: {'sand': 500, 'darksand': 1, 'rock': 1, 'cacti': 10}
            },
            {
                name: 'darksand',
                connections: {'darksand': 500, 'sand': 1, 'rock': 1, 'cacti': 1}
            },
            {
                name: 'cacti',
                connections: {'sand': 100, 'cacti': 1}
            },
            {
                name: 'rock',
                connections: {'sand': 1, 'rock': 1}
            },
            {
                name: 'water',
                connections: {'sand': 10, 'water': 100}
            }
        ]
    });

    world.generate();   // generate world

    // create image
    var image = yield helper.createImageFromArray(world.map, WIDTH, HEIGHT);
    yield helper.writeImage(filename, image);
    console.log(`World saved to ${filename}`);

})
.catch(console.error);
