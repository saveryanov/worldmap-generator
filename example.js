var WorldmapGenerator = require('./index'),
    Jimp = require('jimp'),
    co = require('co');

const WIDTH = 100;
const HEIGHT = 100;

var world = new WorldmapGenerator({
    size: {
        width: WIDTH,
        depth: HEIGHT,
        heigth: 1
    },
    tileTypes: [
        {
            name: 'grass',
            frequency: 10,
            connections: {
                up:     {'grass': 100, 'water': 1, 'forest': 1, 'mountain': 1},
                down:   {'grass': 100, 'water': 1, 'forest': 1, 'mountain': 1},
                left:   {'grass': 100, 'water': 1, 'forest': 1, 'mountain': 1},
                right:  {'grass': 100, 'water': 1, 'forest': 1, 'mountain': 1}
            }
        },
        {
            name: 'forest',
            frequency: 2,
            connections: {
                up:     {'grass': 1, 'water': 0, 'forest': 200, 'mountain': 0},
                down:   {'grass': 1, 'water': 0, 'forest': 200, 'mountain': 0},
                left:   {'grass': 1, 'water': 0, 'forest': 200, 'mountain': 0},
                right:  {'grass': 1, 'water': 0, 'forest': 200, 'mountain': 0}
            }
        },
        {
            name: 'mountain',
            frequency: 2,
            connections: {
                up:     {'grass': 1, 'water': 0, 'forest': 0, 'mountain': 100},
                down:   {'grass': 1, 'water': 0, 'forest': 0, 'mountain': 100},
                left:   {'grass': 1, 'water': 0, 'forest': 0, 'mountain': 100},
                right:  {'grass': 1, 'water': 0, 'forest': 0, 'mountain': 100}
            }
        },
        {
            name: 'water',
            frequency: 1,
            connections: {
                up:     {'grass': 1, 'water': 500, 'forest': 0, 'mountain': 0},
                down:   {'grass': 1, 'water': 500, 'forest': 0, 'mountain': 0},
                left:   {'grass': 1, 'water': 500, 'forest': 0, 'mountain': 0},
                right:  {'grass': 1, 'water': 500, 'forest': 0, 'mountain': 0}
            }
        }
    ]
});


world.generate();











// write it to file



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

co(function* () {

    // create image
    var image = yield createImageFromArray(world.map[0], WIDTH, HEIGHT);
    
    // write image if necessary
    yield writeImage('worldmap3.png', image);

    return image;
})
.catch(console.error);