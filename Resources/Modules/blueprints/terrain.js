exports.hillBase = {
    inherits: "prefab",
    StaticModel: {
        material: "Materials/hilly.material"
    },
    RigidBody: {
        collisionLayer: 2,
        useGravity: false
    },
    CollisionShape: {
        shapeType: Atomic.ShapeType.SHAPE_TRIANGLEMESH,
    }
};

exports.hill1 = {
    inherits: "hillBase",
    StaticModel: { model: "Models/hill1.mdl" },
    CollisionShape: { model: "Models/hill1.mdl" }
};

exports.hill2 = {
    inherits: "hillBase",
    StaticModel: { model: "Models/hill2.mdl" },
    CollisionShape: { model: "Models/hill2.mdl" }
};

exports.hill3 = {
    inherits: "hillBase",
    StaticModel: { model: "Models/hill3.mdl" },
    CollisionShape: { model: "Models/hill3.mdl" }
};

exports.hill4 = {
    inherits: "hillBase",
    StaticModel: { model: "Models/hill4.mdl" },
    CollisionShape: { model: "Models/hill4.mdl" }
};

exports.hill5 = {
    inherits: "hillBase",
    StaticModel: { model: "Models/hill5.mdl" },
    CollisionShape: { model: "Models/hill5.mdl" }
};

exports.mountBase = {
    inherits: "prefab",
    StaticModel: {
        material: "Materials/rocky.material"
    },
    RigidBody: {
        collisionLayer: 2,
        useGravity: false
    },
    CollisionShape: {
        shapeType: Atomic.ShapeType.SHAPE_TRIANGLEMESH,
    }
}

exports.mount1 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount1.mdl" },
    CollisionShape: { model: "Models/mount1.mdl" }
};

exports.mount2 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount2.mdl" },
    CollisionShape: { model: "Models/mount2.mdl" }
};

exports.mount3 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount3.mdl" },
    CollisionShape: { model: "Models/mount3.mdl" }
};

exports.mount4 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount4.mdl" },
    CollisionShape: { model: "Models/mount4.mdl" }
};

exports.mount5 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount5.mdl" },
    CollisionShape: { model: "Models/mount5.mdl" }
};

exports.mount6 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount6.mdl" },
    CollisionShape: { model: "Models/mount6.mdl" }
};

exports.mount7 = {
    inherits: "mountBase",
    StaticModel: { model: "Models/mount7.mdl" },
    CollisionShape: { model: "Models/mount7.mdl" }
};

