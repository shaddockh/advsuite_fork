exports.Block = {
    inherits: "prefab",
    scale: [8, 8, 8],
    StaticModel: {
        model: "Models/Box.mdl",
        material: "Materials/block.material",
        castShadows: true
    },
    RigidBody: {},
    CollisionShape: {}
};

exports.faceBase = {
    inherits: "prefab",
    scale: [8, 8, 8],
    StaticModel: {
        model: "Models/Box.mdl",
        castShadows: true
    },
    RigidBody: {},
    CollisionShape: {}
};

exports.Face = {
    inherits: "faceBase",
    StaticModel: { material: "Materials/face1.material" },
};

exports.Face2 = {
    inherits: "faceBase",
    StaticModel: { material: "Materials/face3.material" },
};

exports.Face3 = {
    inherits: "faceBase",
    StaticModel: { material: "Materials/face3.material" },
};

exports.Face4 = {
    inherits: "faceBase",
    StaticModel: { material: "Materials/face4.material" },
};

exports.Face5 = {
    inherits: "faceBase",
    StaticModel: { material: "Materials/face5.material" },
};