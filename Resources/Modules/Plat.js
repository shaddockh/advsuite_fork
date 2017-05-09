// This script IS the tmx2scene module
// Written By JimMarlowe, 2017
// Using the Atomic Game Engine
// MIT licenesed

//import gl-matrix library  https://github.com/toji/gl-matrix for more information
var glmatrix = require("gl-matrix");
var quat = glmatrix.quat;


// utility function to zero pad a number string, hacked.
function toPaddedString(num, len) {
    var str = num.toString(10);
    // this does not work on windows!?    return "0".repeat(len - str.length) + str;
    // so hack it :)
    if (str.length === 0) return "000";
    else if (str.length == 1) return "00" + str;
    else if (str.length == 2) return "0" + str;
    else if (str.length == 3) return str;
    return "000";
}

// The manifestation of the tmx2scene object, named Plat
function Plat() {

    this.pscene = null;         // reference to current scene object
    this.parts = new Array();   // Array of "Parts" (post process prefabs), loaded from json files
    this.tileX = 0;             // number of tiles in x direction
    this.tileY = 0;             // number of tiles in y direction
    this.tileWH = 8.0;          // width, height of a tile
    this.mapHandle = "platmap"; // name of the node the map is created in.

    // these are added to make a game ...
    this.numSpawn = 0;          // number of spawn points in plat
    this.spawnHandle = 36;      // index in parts factory of a spawn point -- note this is determined by the palette position
    this.spawnPositions = new Array();   // world locations of spawn points
    this.numTreasures = 0;      // number of treasure chests in map
    this.treasureHandle = 37;   // index in parts factory of a treasure chest
}


// init function, prepares for use and reuse.
Plat.prototype.init = function (cscene) {

    this.parts = [];
    this.parts.length = 0;
    this.numSpawn = 0;
    this.numTreasures = 0;
    this.spawnPositions = [];
    this.spawnPositions.length = 0;
    this.tileX = 0;
    this.tileY = 0;
    this.pscene = cscene;

};


// load parts files out of the cache for tmx palette items
Plat.prototype.loadParts = function (num) {

    var fname = "";  // part filename composition
    this.parts[0] = null;  // note slot 0 must be empty, this represents an empty tmx cell.
    for (var nn = 1; nn < num + 1; nn++) {
        this.parts[nn] = null;
        fname = "Parts/part" + toPaddedString(nn, 3) + ".json";
        var pfile = Atomic.cache.getFile(fname);
        if (pfile !== null && pfile.isOpen()) {
            var pstr = pfile.readString();
            this.parts[nn] = JSON.parse(pstr);
            pfile.close();
        }
    }
};

/** Utility function to parse a string array into a numeric array */
function parseNumericArray(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(parseInt(arr[i], 10));
    }
    return result;
}

Plat.prototype.getTileProperties = function (tile) {

    if (tile && tile.hasProperty("prefab") && tile.getProperty("prefab") != "") {
        return {
            comment: tile.getProperty("comment"),
            name: tile.getProperty("name"),
            offset: parseNumericArray(tile.getProperty("offset").split(",")),
            prefab: tile.getProperty("prefab"),
            randpos: parseNumericArray(tile.getProperty("randpos").split(",")),
            randroty: tile.getProperty("randroty") == "true",
            rotation: parseNumericArray(tile.getProperty("rotation").split(",")),
            scale: parseNumericArray(tile.getProperty("scale").split(","))
        };
    }
}

// add a part into the scene  via prefab and part specification
Plat.prototype.plotInScene = function (xi, yi, gi, tile) {
    // Gets the properties from the tiles and if not there, looks at the parts
    var objx = this.getTileProperties(tile) || this.parts[gi];
    if (objx !== null) {
        var mapnode = this.pscene.getChild(this.mapHandle, true); // do it inside of a container node
        if (mapnode === null) return;
        var prefabby = mapnode.createChildPrefab(objx.name, objx.prefab);
        prefabby.scale = objx.scale;
        var xr = xi * this.tileWH;
        var yr = yi * this.tileWH;  // this is really the Z axis ...
        if (objx.randpos[0] !== 0) xr += (Math.random() * objx.randpos[0]) - objx.randpos[0] / 2;
        if (objx.randpos[1] !== 0) yr += (Math.random() * objx.randpos[1]) - objx.randpos[1] / 2;
        prefabby.position = [xr + objx.offset[0], 0.0 + objx.offset[1], yr + objx.offset[2]];
        if (objx.randroty) {
            var dir = quat.create();
            quat.setAxisAngle(dir, [0, 1, 0], Math.random() * 360.0); //set random y value
            prefabby.setRotation([dir[3], dir[0], dir[1], dir[2]]); // rotate node, no pitch change
        }
        if (gi == this.spawnHandle) { // special start location handling
            this.spawnPositions.push([xr, 0.0, yr]);
        }
    }
};


// load the tmx map, populates the scenex, does some record keeping
Plat.prototype.loadTmxMap = function (mapname) {

    if (this.pscene === null)
        return false;  // didnt perform job

    var mapnode = this.pscene.getChild(this.mapHandle, true);
    if (mapnode !== null) { // already instrumented -- remove it
        mapnode.remove();
        mapnode = null;
    }

    if (mapnode === null) {
        mapnode = this.pscene.createChild(this.mapHandle); // and create the container
    }

    var tmxFile = Atomic.cache.getResource("TmxFile2D", mapname); // Get our tmx file
    if (tmxFile === null)
        return false;

    var tileMapNode = this.pscene.createChild("TileMap");

    var tileMap = tileMapNode.createComponent("TileMap2D");
    tileMap.tmxFile = tmxFile;

    var nn = 0;


    for (nn = 0; nn < tileMap.numLayers; nn++) {

        var layerx = tileMap.getLayer(nn); // TileMapLayer2D
        if ((layerx !== null && layerx.name == "Tile Layer 1") || tileMap.numLayers == 1) { // version 1 ONLY reads this layer name
            // or if there is only one layer
            this.tileX = layerx.width;   // capture number of tiles in x direction
            this.tileY = layerx.height;  // capture number of tiles in y direction
            var xx;
            var yy;
            var maxgid = 0;
            for (xx = 0; xx < layerx.height; xx++) // go thru the map to find the highest gid
                for (yy = 0; yy < layerx.width; yy++) {
                    var tile2d = layerx.getTile(xx, yy);
                    if (tile2d !== null)
                        if (tile2d.getGid() > maxgid) {
                            maxgid = tile2d.getGid();
                        }
                }

            this.loadParts(maxgid); // load in parts files, now that we know how many are in the tmx map

            for (xx = 0; xx < layerx.height; xx++) {  // now unpack the tmx map
                for (yy = 0; yy < layerx.width; yy++) {
                    var mygid = 0;
                    var tile2d = layerx.getTile(xx, yy);
                    if (tile2d !== null) mygid = tile2d.getGid();
                    if (mygid == this.spawnHandle) this.numSpawn++; // count start points
                    if (mygid == this.treasureHandle) this.numTreasures++; // count treasures
                    this.plotInScene((layerx.height - 1) - xx, yy, mygid, tile2d); // make it look like it is in tiled
                }
            }
        }
    }

    /*  A L E R T -- TileMapInfo2D is not in JS ! I dont know if we care. */

    tileMapNode.remove();  // get rid of this before we save it otherwise we SEE it...

    //console.log ( "Plat.prototype.loadTmxMap " +  mapname );
    //console.log ( "Plat.prototype.loadTmxMap numSpawn= " +  this.numSpawn );
    //console.log ( "Plat.prototype.loadTmxMap numTreasures= " +  this.numTreasures );

    return true; // everything is fine.
};

// returns the coordinates of a random spawn point
Plat.prototype.getRandomSpawn = function () {
    if (this.numSpawn === 0) return [0, 0, 0]; // wtf!
    else if (this.numSpawn === 1) return this.spawnPositions[0];
    var where = Math.round(Math.random() * (this.numSpawn - 1));
    return this.spawnPositions[where];
};

// returns the number of spawn points
Plat.prototype.getNumSpawn = function () {
    return this.numSpawn;
};

// returns the number of treasures
Plat.prototype.getNumTreasure = function () {
    return this.numTreasures;
};

// returns the map width/X in tiles
Plat.prototype.getMapX = function () {
    return this.tileX;
};

// returns the map height/Y in tiles
Plat.prototype.getMapY = function () {
    return this.tileY;
};

// returns the scene it is using
Plat.prototype.getScene = function () {
    return this.pscene;
};

// returns the number of parts
Plat.prototype.numParts = function () {
    return this.parts.length;
};

// returns the part name at index
Plat.prototype.numParts = function (nn) {
    if (this.parts[nn])
        return this.parts[nn].name;
    return "";
};

// utility function to save the scene file
Plat.prototype.saveScene = function (filename) {

    if (this.pscene === null) return false;

    var filexml = new Atomic.File(filename, Atomic.FILE_WRITE);
    if (this.pscene.saveXML(filexml)) {
        if (filexml.isOpen())
            filexml.close();
        return true;
    }
    return false;

}

Atomic.Plat = exports.Plat = new Plat();
