/*
 * Usage example file
 */

var WorldmapGenerator = require('../../index'),
    helper = require('../examples_helper'),
    co = require('co');

const WIDTH = 500;
const HEIGHT = 500;

var filename = __dirname + '/ocean.png';

co(function* () {
    var world = new WorldmapGenerator({
        size: {
            width: WIDTH,
            height: HEIGHT
        },
        tileTypes: [
            {
                name: 'grass',
                connections: {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 2}
            },
            {
                name: 'forest',
                connections: {'grass': 1, 'forest': 100}
            },
            {
                name: 'mountain',
                connections: {'grass': 1, 'mountain': 10}
            },
            {
                name: 'water',
                connections: {'water': 500, 'sand': 1}
            },
            {
                name: 'sand',
                connections: {'grass': 1, 'water': 500, 'sand': 10}
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
