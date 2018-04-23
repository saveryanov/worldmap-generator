var WorldmapGenerator = require('./index');

var world = new WorldmapGenerator({
    size: {
        width: 2,
        depth: 2,
        heigth: 1
    },
    tileTypes: [
        {
            name: 'grass',
            frequency: 1,
            connections: {
                top: {'grass': 2, 'water': 1},
                bottom: {'grass': 2, 'water': 1},
                up: {'grass': 2, 'water': 1},
                down: {'grass': 2, 'water': 1},
                left: {'grass': 2, 'water': 1},
                right: {'grass': 2, 'water': 1}
            }
        },
        {
            name: 'water',
            frequency: 1,
            connections: {
                top: {'grass': 1, 'water': 2},
                bottom: {'grass': 1, 'water': 2},
                up: {'grass': 1, 'water': 2},
                down: {'grass': 1, 'water': 2},
                left: {'grass': 1, 'water': 2},
                right: {'grass': 1, 'water': 2}
            }
        }
    ]
});

console.log(world.tileTypes.grass);
console.log(world.tileTypes.water);

world.generate();
console.log(world.map[0]);