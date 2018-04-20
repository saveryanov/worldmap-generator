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
            connections: {
                top: 1,
                bottom: 1,
                up: 1,
                down: 1,
                left: 1,
                rigth: 1
            }
        }
    ]
});

console.log(world);
console.log(world.map);
console.log(world.tileTypes);
