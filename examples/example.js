/*
 * Usage example file
 */

var WorldmapGenerator = require('../index'),
    helper = require('./examples_helper'),
    co = require('co');

const WIDTH = 300;
const HEIGHT = 300;

var filename = __dirname + '/result.png';

co(function* () {

    console.time("Generator inited");
    var world = new WorldmapGenerator({
        size: {
            width: WIDTH,
            height: HEIGHT
        },
        tileTypes: [
            {
                name: 'grass',
                connections: {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 1}
            },
            {
                name: 'forest',
                connections: {'grass': 1, 'forest': 300}
            },
            {
                name: 'mountain',
                connections: {'grass': 1, 'mountain': 150}
            },
            {
                name: 'water',
                connections: {'water': 500, 'sand': 1}
            },
            {
                name: 'sand',
                connections: {'grass': 1, 'water': 1, 'sand': 50}
            }
        ]
    });
    console.timeEnd("Generator inited");

    // generate world
    console.time("World generated");
    world.generate();
    console.timeEnd("World generated");

    // create image
    console.time(`World saved to ${filename}`);
    var image = yield helper.createImageFromArray(world.map, WIDTH, HEIGHT);
    yield helper.writeImage(filename, image);
    console.timeEnd(`World saved to ${filename}`);

})
.catch(console.error);
