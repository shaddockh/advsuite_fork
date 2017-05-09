"use strict";
/*
  Blueprints live here.  You can either define
  them in this module by using the format:

  
    export const star = {
        Star: {},
        // generate the prefabs into Resources/Prefabs/autogen/stars/..
        // Note that this value is inherited by all child blueprints and it's possible
        // to have different directories for differetn types of blueprints
        prefabDir: "Prefabs/autogen/stars",
        isPrefab: true,
        StaticSprite2D: {
            sprite: "Sprites/star.png",
            blendMode: Atomic.BlendMode.BLEND_ALPHA
        }
    };

    or export another file like:

    export * from "./blueprints/myblueprints";
*/
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

__export(require("./blueprints/objects"));
__export(require("./blueprints/trees"));