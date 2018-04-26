/*
 * Usage example file
 */

var WorldmapGenerator = require('../../index'),
    helper = require('../examples_helper'),
    co = require('co');

const WIDTH = 300;
const HEIGHT = 300;

var filename = __dirname + '/forest.png';

co(function* () {
    var world = new WorldmapGenerator({
        size: {
            width: WIDTH,
            height: HEIGHT
        },
        tileTypes: [
            {
                name: 'grass',
                connections: {'grass': 100, 'forest': 1, 'rock': 1}
            },
            {
                name: 'forest',
                connections: {'grass': 1, 'forest': 700}
            },
            {
                name: 'rock',
                connections: {'grass': 1, 'rock': 50}
            },
            {
                name: 'water',
                connections: {'water': 100, 'grass': 1}
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
