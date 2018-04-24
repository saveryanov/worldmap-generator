# worldmap-generator

[![NPM version](https://img.shields.io/npm/v/worldmap-generator.svg)](https://www.npmjs.com/package/worldmap-generator)

Procedural worldmap generator.

![alt example](https://github.com/saveryanov/worldmap-generator/blob/master/examples/result2d.png?raw=true)

## Install

```commandline
npm install --save worldmap-generator
```

## Usage

You can find usage example at /examples/example2d.js. 3D generator in progress.

Simple usage is:

```js

// create world
var world = new WorldmapGenerator(params);

// generate map
world.generate();
```

After executing *world.generate()* you can find your map at *world.map*.

**params** must contain size and tileTypes elements:

**params.size** (sizes of world to generate):

* height
* width
* depth

**params.tileTypes** (types and it's connections to each other):

* name - tile type name (will written to map cells)
* frequency - how often this tile will be placed when no tiles placed around
* connections - connections to other tiles around where keys are possible sides: top, bottom, up, down, left, right

All connections must be defined with this format where key is a tile type name and value is connection frequency (how often this tile will be placed at this side):

```js
{'grass': 500, 'water': 0, 'forest': 1, 'mountain': 1, 'sand': 1}
```