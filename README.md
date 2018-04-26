# worldmap-generator

[![NPM version](https://img.shields.io/npm/v/worldmap-generator.svg)](https://www.npmjs.com/package/worldmap-generator)

Procedural 2D worldmap generator. It can generate maps defined at material structure that allow you to create different biomes.

*Generated map with grass, forest, water, sand and mountains*

![alt example](https://raw.githubusercontent.com/saveryanov/worldmap-generator/master/examples/result.png)

*Increased amount of water (ocean biome)*

![alt ocean](https://raw.githubusercontent.com/saveryanov/worldmap-generator/master/examples/biomes/ocean.png)

*Increased amount of forests (forest biome)*

![alt forest](https://raw.githubusercontent.com/saveryanov/worldmap-generator/master/examples/biomes/forest.png)

*Increased amount of sand and with cactis (desert biome)*

![alt desert](https://raw.githubusercontent.com/saveryanov/worldmap-generator/master/examples/biomes/desert.png)

## Install

```commandline
npm install --save worldmap-generator
```

## Usage

You can find usage example at /examples/example.js.

Simple usage is:

```js
var WorldmapGenerator = require('worldmap-generator');

// create world with some params
var world = new WorldmapGenerator({
    size: {
        width: 300, // map width
        heigth: 300 // map height
    },
    tileTypes: [    // map tiles and connections
        {
            name: 'grass',  // tile name
            connections: {'grass': 500, 'forest': 1, 'mountain': 1, 'sand': 1}  // connections to surrounding tiles with its frequencies
            // frequency is used for calculating probabillity of appearence next to this tile
        },
        {
            name: 'forest',
            frequency: 1,
            connections: {'grass': 1, 'forest': 200}
        },
        {
            name: 'mountain',
            connections: {'grass': 1, 'mountain': 150}
        },
        {
            name: 'water',
            frequency: 1,
            connections: {'water': 500, 'sand': 1}
        },
        {
            name: 'sand',
            frequency: 1,
            connections: {'grass': 1, 'water': 1, 'sand': 50}
        }
    ]
});

world.generate();   // generate map
```

After executing *world.generate()* you can find your map at *world.map*.

**params** must contain size and tileTypes elements:

**params.size** (sizes of world to generate):

* height
* width

**params.tileTypes** (types and it's connections to each other):

* name - tile type name (will written to map cells)
* connections - connections to other tiles around

All connections must be defined with format where key is a tile type name and value is connection frequency (how often connection tile will be appeared next to this tile):

```js
{'grass': 500, 'water': 0, 'forest': 1, 'mountain': 1, 'sand': 1}
```

In this example *grass* tile can be connected with high probability, *forest*/*mountain*/*sand* with low probability and *water* can't connect to this tile at all.

If connection type isn't set in connections object its frequency will be set as 0.

### Biomes

You can find some biome examples at */examples/biomes* folder.

* desert.js
* forest.js
* ocean.js
