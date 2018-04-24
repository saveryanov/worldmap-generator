/*
 * Usage example file
 */

var WorldmapGenerator = require('../index'),
    Jimp = require('jimp'),
    co = require('co');

const WIDTH = 300;
const DEPTH = 300;
const HEIGHT = 1;

// write it to file

co(function* () {

    console.time("Generator inited");
    var world = new WorldmapGenerator({
        size: {
            width: WIDTH,
            depth: DEPTH,
            heigth: HEIGHT
        },
        tileTypes: [
            {
                name: 'grass',
                frequency: 1,
                connections: {
                    up:     {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 1},
                    down:   {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 1},
                    left:   {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 1},
                    right:  {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 1}
                }
            },
            {
                name: 'forest',
                frequency: 1,
                connections: {
                    up:     {'grass': 1, 'forest': 200},
                    down:   {'grass': 1, 'forest': 200},
                    left:   {'grass': 1, 'forest': 200},
                    right:  {'grass': 1, 'forest': 200}
                }
            },
            {
                name: 'mountain',
                frequency: 1,
                connections: {
                    up:     {'grass': 1, 'mountain': 150},
                    down:   {'grass': 1, 'mountain': 150},
                    left:   {'grass': 1, 'mountain': 150},
                    right:  {'grass': 1, 'mountain': 150}
                }
            },
            {
                name: 'icepeak',
                frequency: 1,
                connections: {
                    up:     {'icepeak': 15, 'mountain': 5},
                    down:   {'icepeak': 15, 'mountain': 5},
                    left:   {'icepeak': 15, 'mountain': 5},
                    right:  {'icepeak': 15, 'mountain': 5}
                }
            },
            {
                name: 'water',
                frequency: 1,
                connections: {
                    up:     {'water': 500, 'sand': 1},
                    down:   {'water': 500, 'sand': 1},
                    left:   {'water': 500, 'sand': 1},
                    right:  {'water': 500, 'sand': 1}
                }
            },
            {
                name: 'sand',
                frequency: 1,
                connections: {
                    up:     {'grass': 1, 'water': 1, 'sand': 50},
                    down:   {'grass': 1, 'water': 1, 'sand': 50},
                    left:   {'grass': 1, 'water': 1, 'sand': 50},
                    right:  {'grass': 1, 'water': 1, 'sand': 50}
                }
            }
        ]
    });
    console.timeEnd("Generator inited");
    
    // generate world
    console.time("World generated");
    world.generate();
    console.timeEnd("World generated");

    // create image
    console.time("World saved to 'result2d.png'");
    var image = yield createImageFromArray(world.map[0], WIDTH, DEPTH);
    yield writeImage('result2d.png', image);
    console.timeEnd("World saved to 'result2d.png'");

})
.catch(console.error);


function newImage(width, height) {
    return new Promise((resolve, reject) => {
        new Jimp(width, height, function (err, image) {
            if (err) {
                reject(err);
            } else {
                resolve(image);
            }
        });
    });
}

function createImageFromArray(pixels, imgWidth, imgHeight) {
    return co(function *() {
        var image = yield newImage(imgWidth, imgHeight);
        pixels.forEach((row, y) => {
            row.forEach((mapCell, x) => {
                var pixelRGB = [];
                switch (mapCell.name) {
                    case 'grass': pixelRGB = [10, 50, 10]; break;
                    case 'forest': pixelRGB = [10, 25, 10]; break;
                    case 'water': pixelRGB = [0, 0, 100]; break;
                    case 'mountain': pixelRGB = [100, 100, 100]; break;
                    case 'icepeak': pixelRGB = [255, 255, 255]; break;
                    case 'sand': pixelRGB = [100, 100, 0]; break;
                    default: pixelRGB = [0, 0, 0]; break;
                }
                var pixelHEX = Jimp.rgbaToInt(pixelRGB[0], pixelRGB[1], pixelRGB[2], 255);
                image.setPixelColor(pixelHEX, x, y);
            });
        });
        return image;
    });
}


function writeImage(fileName, image) {
    return new Promise((resolve, reject) => {
        // write image if necessary
        if (fileName) {
            image.write(fileName, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        } else {
            resolve(false);
        }
    });
}