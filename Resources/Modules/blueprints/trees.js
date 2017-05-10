exports.baseTree = {
    inherits: "prefab",
    RigidBody: {
        collisionLayer: 2,
        useGravity: false
    },
    StaticModel: {
        castShadows: true
    },
    CollisionShape: {
        shapeType: Atomic.ShapeType.SHAPE_BOX
    }
}

exports.evergreenBase = {
    inherits: "baseTree",
    StaticModel: {
        material: "Materials/needley.material;Materials/trunky.material"
    }
}

exports.evergreen1 = {
    inherits: "evergreenBase",
    StaticModel: { model: "Models/evergreen1.mdl" },
    CollisionShape: {
        size: [4, 6.26946, 4],
        offsetPosition: [2.74454, 3.10282, 0.118298]
    }
};

exports.evergreen2 = {
    inherits: "evergreenBase",
    StaticModel: { model: "Models/evergreen2.mdl" },
    CollisionShape: {
        size: [4, 5.77014, 4],
        offsetPosition: [2.22866, 2.87798, 0.983223]
    }
}

exports.evergreen3 = {
    inherits: "evergreenBase",
    StaticModel: { model: "Models/evergreen3.mdl" },
    CollisionShape: {
        size: [4, 6.23375, 4],
        offsetPosition: [1.58103, 3.18544, -0.86132]
    }
}

exports.palmBase = {
    inherits: "baseTree",
    StaticModel: {
        material: "Materials/barky.material;Materials/leafy.material"
    }
}

exports.palm1 = {
    inherits: "palmBase",
    StaticModel: { model: "Models/palm1.mdl", },
    CollisionShape: {
        size: [1.2, 8.11867, 1.2],
        offsetPosition: [-0.747753, 4.06029, -0.871786]
    }
}

exports.palm2 = {
    inherits: "palmBase",
    StaticModel: { model: "Models/palm2.mdl" },
    CollisionShape: {
        size: [1.2, 7.85562, 1.2],
        offsetPosition: [-0.0315316, 3.92877, -0.871786]
    }
}

exports.palm3 = {
    inherits: "palmBase",
    StaticModel: { model: "Models/palm3.mdl" },
    CollisionShape: {
        size: [1.2, 7.83111, 1.2],
        offsetPosition: [-0.00382441, 3.91556, -0.345591]
    }
}

exports.pineBase = {
    inherits: "baseTree",
    StaticModel: {
        material: "Materials/barky.material;Materials/firy.material"
    }
}

exports.pine1 = {
    inherits: "pineBase",
    StaticModel: { model: "Models/pine1.mdl" },
    CollisionShape: {
        size: [2, 6.11041, 2],
        offsetPosition: [-0.531112, 3.05521, -0.00161552]
    }
}

exports.pine2 = {
    inherits: "pineBase",
    StaticModel: { model: "Models/pine2.mdl" },
    CollisionShape: {
        size: [2, 6.11041, 2],
        offsetPosition: [0.378418, 3.05521, -0.170162]
    }
}

exports.pine3 = {
    inherits: "pineBase",
    StaticModel: { model: "Models/pine3.mdl" },
    CollisionShape: {
        size: [2, 6.11041, 2],
        offsetPosition: [0.111364, 3.05521, 0.430125]
    }
}

exports.genericTreeBase = {
    inherits: "baseTree",
    StaticModel: {
        material: "Materials/leavey.material;Materials/trunky.material"
    }
}

exports.tree1 = {
    inherits: "genericTreeBase",
    StaticModel: { model: "Models/tree1.mdl" },
    CollisionShape: {
        size: [1.5, 7.82132, 1.5],
        offsetPosition: [-0.0207489, 3.53303, 0.352515]
    }
}

exports.tree2 = {
    inherits: "genericTreeBase",
    StaticModel: { model: "Models/tree2.mdl" },
    CollisionShape: {
        size: [1.5, 5.8, 1.5],
        offsetPosition: [-0.435649, 2.7484, -0.202483]
    }
}

exports.tree3 = {
    inherits: "genericTreeBase",
    StaticModel: { model: "Models/tree3.mdl" },
    CollisionShape: {
        size: [1.2, 10.8948, 1.2],
        offsetPosition: [1.69907, 5.40636, -0.193362]
    }
}

exports.tree4 = {
    inherits: "genericTreeBase",
    StaticModel: { model: "Models/tree4.mdl" },
    CollisionShape: {
        size: [1.1, 10.9816, 1.1],
        offsetPosition: [0.628782, 5.25694, -0.254854]
    }
}

exports.deadTreeBase = {
    inherits: "baseTree",
    StaticModel: {
        material: "Materials/trunky.material"
    }
}

exports.deadtree1 = {
    inherits: "deadTreeBase",
    StaticModel: { model: "Models/deadtree1.mdl" },
    CollisionShape: {
        size: [1, 2.47825, 1],
        offsetPosition: [-0.060015, 1.18563, -0.000920057]
    }
}

exports.deadtree2 = {
    inherits: "deadTreeBase",
    StaticModel: { model: "Models/deadtree2.mdl" },
    CollisionShape: {
        size: [1, 7.99892, 1],
        offsetPosition: [-0.0743864, 3.96548, 0.774808]
    }
}    