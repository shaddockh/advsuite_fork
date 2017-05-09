exports.baseObject = {
    prefabDir: "Prefabs",
    isPrefab: true,
};

exports.Block = {
    inherits: "baseObject",
    scale: [8, 8, 8],
    StaticModel: {
        model: "Models/Box.mdl",
        material: "Materials/block.material",
        castShadows: true
    },
    RigidBody: {},
    CollisionShape: {}
};

exports.chestBase = {
    inherits: "baseObject",
    scale: [0.01, 0.01, 0.01],
    StaticModel: {
        model: "Models/Chest.mdl",
        material: "Models/Materials/chest.material",
        castShadows: true
    },
    RigidBody: {},
    CollisionShape: {
        size: [82.8973, 57.648, 55.3238],
        offsetPosition: [0, 26, 1]
    },
};

exports.Chest = {
    inherits: "chestBase",
    chest: {}
};

exports.FoolsGold = {
    inherits: "chestBase",
    foolsgold: {}
};

exports.eggBase = {
    inherits: "baseObject",
    StaticModel: {
        model: "Models/Cylinder.mdl"
    }
};

exports.egg1 = {
    inherits: "eggBase",
    StaticModel: { material: "Materials/egg1.material" }
};

exports.egg2 = {
    inherits: "eggBase",
    StaticModel: { material: "Materials/egg2.material" }
};

exports.egg3 = {
    inherits: "eggBase",
    StaticModel: { material: "Materials/egg3.material" }
};

exports.faceBase = {
    inherits: "baseObject",
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

exports.Spawn = {
    inherits: "baseObject",
    scale: [1, 0.01, 1],
    StaticModel: {
        model: "Models/Cylinder.mdl",
        material: "Materials/spot1.material"
    }
}

exports.psionic_dwarf = {
    inherits: "baseObject",
    AnimatedModel: {
        model: "Models/DwarfJM/psionic_dwarf_jm.mdl",
        material: "Models/DwarfJM/Materials/dwarf.material;Models/DwarfJM/Materials/dwarf.material;Models/DwarfJM/Materials/dwarf.material",
        castShadows: true,
        animationStates: [0]
    },
    Character: {},
    CharacterController: {},
    RigidBody: {
        mass: 1,
        angularFactor: [0, 0, 0],
        collisionEventMode: Atomic.CollisionEventMode.COLLISION_ALWAYS
    },
    CollisionShape: {
        shapeType: Atomic.ShapeType.SHAPE_CAPSULE,
        size: [20, 60, 1],
        offsetPosition: [0, 26, 0]
    },
    AnimationController: {
        nodeAnimationsStates: [
            0
        ]
    }
};
