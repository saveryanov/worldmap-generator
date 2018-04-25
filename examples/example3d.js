/*
 * Usage example file
 */

var WorldmapGenerator = require('../index'),
    Jimp = require('jimp'),
    co = require('co');

const WIDTH = 100;
const DEPTH = 100;
const HEIGHT = 7;

// write it to file

co(function* () {

    console.time("Generator inited");
    var world = new WorldmapGenerator({
        size: {
            width: WIDTH,
            depth: DEPTH,
            height: HEIGHT
        },
        tileTypes: [
            {
                name: 'grass',
                frequency: 10,
                connections: {
                    top:    {'air': 250, 'grass': 250},
                    up:     {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 2},
                    down:   {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 2},
                    left:   {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 2},
                    right:  {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 2}
                },
                limits: {
                    max: {
                        z: HEIGHT - 1
                    }
                }
            },
            {
                name: 'air',
                frequency: 0,
                connections: {
                    top:    {'air': 1000},
                    up:     {'air': 1000, 'mountain': 1, 'grass': 1},
                    down:   {'air': 1000, 'mountain': 1, 'grass': 1},
                    left:   {'air': 1000, 'mountain': 1, 'grass': 1},
                    right:  {'air': 1000, 'mountain': 1, 'grass': 1},
                },
                limits: {
                    min: {
                        z: 3
                    }
                }
            },
            {
                name: 'forest',
                frequency: 10,
                connections: {
                    top:    {'air': 1000},
                    up:     {'grass': 1, 'forest': 250},
                    down:   {'grass': 1, 'forest': 250},
                    left:   {'grass': 1, 'forest': 250},
                    right:  {'grass': 1, 'forest': 250}
                },
                limits: {
                    max: {
                        z: HEIGHT - 1
                    }
                }
            },
            {
                name: 'mountain',
                frequency: 10,
                connections: {
                    top:    {'air': 1000, 'mountain': 1000},
                    up:     {'grass': 1, 'mountain': 150},
                    down:   {'grass': 1, 'mountain': 150},
                    left:   {'grass': 1, 'mountain': 150},
                    right:  {'grass': 1, 'mountain': 150}
                },
                limits: {
                    max: {
                        z: HEIGHT - 1
                    }
                }
            },
            {
                name: 'water',
                frequency: 10,
                connections: {
                    top:    {'air': 10000},
                    up:     {'water': 500, 'sand': 1},
                    down:   {'water': 500, 'sand': 1},
                    left:   {'water': 500, 'sand': 1},
                    right:  {'water': 500, 'sand': 1}
                },
                limits: {
                    max: {
                        z: HEIGHT - 1
                    }
                }
            },
            {
                name: 'sand',
                frequency: 10,
                connections: {
                    top:    {'air': 10000, 'sand': 100},
                    up:     {'grass': 1, 'water': 1, 'sand': 50},
                    down:   {'grass': 1, 'water': 1, 'sand': 50},
                    left:   {'grass': 1, 'water': 1, 'sand': 50},
                    right:  {'grass': 1, 'water': 1, 'sand': 50}
                },
                limits: {
                    max: {
                        z: HEIGHT - 1
                    }
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
    for (let z = 0; z < HEIGHT; z++) {
        let filename = `result3d_lvl${z}.png`;
        console.time(`World saved to '${filename}'`);
        var image = yield createImageFromArray(world.map[z], WIDTH, DEPTH);
        yield writeImage(filename, image);
        console.timeEnd(`World saved to '${filename}'`);
    }

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
                    case 'air': pixelRGB = [255, 255, 255]; break;
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