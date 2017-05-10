exports.chestBase = {
    inherits: "prefab",
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
    inherits: "prefab",
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
exports.Spawn = {
    inherits: "prefab",
    scale: [1, 0.01, 1],
    StaticModel: {
        model: "Models/Cylinder.mdl",
        material: "Materials/spot1.material"
    }
}

exports.psionic_dwarf = {
    inherits: "prefab",
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
