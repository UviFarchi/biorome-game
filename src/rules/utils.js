  
const requirements = {
    harvest: {
        // PLANTS
        'Corn': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'camera', subtype: 'rgb'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'gripper'}
        ],
        'Tomato': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'camera', subtype: 'rgb'},
            {type: 'arm', subtype: 'medium'},
            {type: 'gripper'}
        ],
        'Lettuce': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'camera', subtype: 'rgb'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'}
        ],
        'Pumpkin': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'cutter'}
        ],
        'Carrot': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'digger'}
        ],
        'Grass': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cutter', subtype: 'rotating'}
        ],
        'Coffee': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'}
        ],
        'Apple Tree': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'gripper'}
        ],
        'Lavender': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'}
        ],
        'Clover': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cutter', subtype: 'rotating'}
        ],
        'Sunflower': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'gripper'}
        ],
        'Oak Tree': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'heavy'},
            {type: 'cart'},
            {type: 'cutter', subtype: 'saw'}
        ],
        'Poplar': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'heavy'},
            {type: 'cart'},
            {type: 'cutter', subtype: 'saw'}
        ],
        'Willow': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'heavy'},
            {type: 'cart'},
            {type: 'cutter', subtype: 'saw'}
        ],
        'Strawberry': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'}
        ],
        'Blueberry': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'}
        ],
        'Pear Tree': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'gripper'}
        ],
        'Almond Tree': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'gripper'}
        ],
        'Wheat': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cutter', subtype: 'rotating'},
            {type: 'cart'}
        ],
        'Barley': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cutter', subtype: 'rotating'},
            {type: 'cart'}
        ],
        'Oats': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cutter', subtype: 'rotating'},
            {type: 'cart'}
        ],

        // NEW FRUIT TREES
        'Orange Tree': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'gripper'}
        ],
        'Lemon Tree': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'cart'},
            {type: 'gripper'}
        ],

        // NEW VINE
        'Grape Vine': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'},
            {type: 'cart'}
        ],

        // ANIMAL PRODUCTS
        'milk': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'medium'},
            {type: 'gripper'}
        ],
        'Goat Milk': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'gripper'}
        ],
        'Eggs': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'camera', subtype: 'rgb'},
            {type: 'arm', subtype: 'small'},
            {type: 'suction'},
            {type: 'cart'}
        ],
        'Duck Eggs': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'camera', subtype: 'rgb'},
            {type: 'arm', subtype: 'small'},
            {type: 'suction'},
            {type: 'cart'}
        ],
        'Honey': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'extractor', subtype: 'honey'}
        ],
        'Wool': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'arm', subtype: 'small'},
            {type: 'brush'}
        ],
        'Cow': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cart', subtype: 'animal'}
        ],
        'Goat': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cart', subtype: 'animal'}
        ],
        'Sheep': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cart', subtype: 'animal'}
        ],
        'Pig': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cart', subtype: 'animal'}
        ],
        'Chicken': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cage'}
        ],
        'Duck': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cage'}
        ],
        'Rabbit': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cage'}
        ],
        'Horse': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cart', subtype: 'animal'}
        ],
        'Donkey': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'cart', subtype: 'animal'}
        ],
        'Bee': [
            {type: 'transport'},
            {type: 'battery'},
            {type: 'box', subtype: 'hive'}
        ]
    },
    planting:{
        Seed: [
            {type: 'transport'},
            {type: 'arm'},
            {type: 'seeder'},
            {type: 'borer'}
        ],
        Seedling: [
            {type: 'transport'},
            {type: 'arm'},
            {type: 'cart'},
            {type: 'gripper'}
        ]
    },
    collar: [
        {type: 'collar'},
        {type: "alarm", subtype: "electric"},
        {type: "alarm", subtype: "sound"},
        {type: 'battery'},
        {type: "gps"},

    ],
    moveAnimal:  [
        {type: 'transport'},
        {type: 'arm'},
        {type: 'cart'},
        {type: "alarm", subtype: "electric"}
    ]
}

/**
 * Checks if the given assembly meets ALL requirementsType in a list.
 * Used for harvest, planting, moving, etc.
 * @param {Object} assembly
 * @param {String} requirementsType
 * @returns {Boolean}
 */
 function assemblyMeetsRequirements(assembly, requirementsType) {
     let localRequirements = requirements[requirementsType]
    if (!assembly || !assembly.modules) return false
    return localRequirements.every(req =>
        assembly.modules.some(m =>
            (!req.type || m.type === req.type) &&
            (!req.subtype || m.subtype === req.subtype) &&
            (!req.name || m.name === req.name)
        )
    )
}

/**
 * Returns a list of human-readable missing modules for a requirement.
 * @param {Object} assembly
 * @param {Array} requirementsType
 * @returns {Array<String>}
 */
 function getMissingModules(assembly, requirementsType) {
    let localRequirements = requirements[requirementsType]
     if (!assembly || !assembly.modules) {
        return requirementsType.map(req => req.name || req.type || JSON.stringify(req))
    }
    return localRequirements
        .filter(req =>
            !assembly.modules.some(m =>
                (!req.type || m.type === req.type) &&
                (!req.subtype || m.subtype === req.subtype) &&
                (!req.name || m.name === req.name)
            )
        )
        .map(req => req.name || req.type || JSON.stringify(req))
}

/**
 * Rule: Can this assembly harvest this plant now?
 * @param {Object} tile
 * @param {String} assemblyId
 * @returns {Boolean}
 */
 function canHarvestPlant(tile, assemblyId) {
    if (
        !tile.plant ||
        !(tile.plant.growthStage === 'Mature' || tile.plant.growthStage === 'Overripe') ||
        !tile.assemblies ||
        !tile.assemblies.length
    ) return false

    const productType = tile.plant.type
    const reqs =requirements[requirementsType][productType];
    if (!reqs) return false
    const assembly = tile.assemblies.find(a => a.id === assemblyId)
    return assembly && assemblyMeetsRequirements(assembly, reqs)
}

/**
 * Rule: Can this assembly harvest this animal *product* now?
 * @param {Object} tile
 * @param {String} assemblyId
 * @param {Object} animalProduct - product object for this animal
 * @param {Number} today - current game day
 * @returns {Boolean}
 */
 function canHarvestAnimalProduct(tile, assemblyId, animalProduct, today) {
    if (!tile.animal || !tile.assemblies || !animalProduct) return false
    const reqs = requirements[requirementsType][animalProduct.key]
    if (!reqs) return false
    if (typeof tile.animal.nextHarvest === "undefined") tile.animal.nextHarvest = today
    const assembly = tile.assemblies.find(a => a.id === assemblyId)
    return assembly && assemblyMeetsRequirements(assembly, reqs) && today >= tile.animal.nextHarvest
}

/**
 * Rule: Can this assembly harvest (butcher) this animal now?
 * @param {Object} tile
 * @param {String} assemblyId
 * @returns {Boolean}
 */
 function canHarvestAnimal(tile, assemblyId) {
    if (!tile.animal || !tile.assemblies) return false
    const animalType = tile.animal.type
    const reqs = requirements[requirementsType][animalType]
    if (!reqs) return false
    const assembly = tile.assemblies.find(a => a.id === assemblyId)
    return assembly && assemblyMeetsRequirements(assembly, reqs)
}

/**
 * Rule: Can this assembly plant this seed/seedling on a tile?
 * This is a pure requirementsType check, not a placement logic.
 * @param {Object} assembly
 * @param {'Seed'|'Seedling'} plantingType
 * @returns {Boolean}
 */
 function canSowPlant(assembly, plantingType) {
    const reqs = requirements.planting[plantingType] || []
    return assemblyMeetsRequirements(assembly, reqs)
}

/**
 * Rule: Can this assembly move an animal?
 * @param {Object} assembly
 * @returns {Boolean}
 */
 function canMoveAnimal(assembly) {
    return assemblyMeetsRequirements(assembly, "moveAnimal")
}

/**
 * Rule: Does this assembly qualify as a "collar assembly" for geofencing?
 * @param {Object} assembly
 * @returns {Boolean}
 */
 function assemblyIsCollar(assembly) {
    return assemblyMeetsRequirements(assembly, "collar")
}

/**
 * Rule: List of valid destination tiles for moving an animal with collar restrictions.
 * (Does not check for actions/moves left, only for restrictions & occupancy)
 * @param {Object} animal - the animal being moved
 * @param {Array<Array<Object>>} tiles - 2D grid of all tiles
 * @returns {Array<{row: Number, col: Number}>}
 */
 function validAnimalDestTiles(animal, tiles) {
    if (!animal) return []
    const restriction = animal.collar?.restrictedTiles
    const out = []
    if (!restriction || !restriction.length) {
        for (let row = 0; row < tiles.length; row++) {
            for (let col = 0; col < tiles[0].length; col++) {
                if (!tiles[row][col].animal) out.push({row, col})
            }
        }
        return out
    }
    return restriction.filter(({row, col}) => !tiles[row][col].animal)
}


/**
 * Returns a 2D array of module names matching the given requirements.
 *
 * @param {Array<{type: string, subtype?: string|null}>} requirements
 *   Array of objects specifying the module type and optional subtype to match.
 *   If subtype is omitted or undefined, all modules with the matching type are included.
 * @param {{value: Array<{name: string, type: string, subtype?: string|null}>}} availableModules
 *   Ref-wrapped array (e.g. from Vue's ref()) of available module objects.
 * @returns {string[][]}
 *   An array where each element is an array of module names matching the corresponding requirement.
 */
function getMatchingModuleNames(requirements, availableModules) {
    return requirements.map(req => {
        return availableModules.value.filter(mod => {
            // Type must match
            if (mod.type !== req.type) return false;
            // If subtype is specified, match exactly (null means any)
            if ('subtype' in req && req.subtype !== undefined && req.subtype !== null)
                return mod.subtype === req.subtype;
            // Otherwise, match any subtype
            return true;
        }).map(mod => mod.name);
    });
}


export {assemblyMeetsRequirements, getMissingModules, canHarvestPlant, canHarvestAnimalProduct, canHarvestAnimal, canMoveAnimal, canSowPlant, assemblyIsCollar, validAnimalDestTiles, getMatchingModuleNames}