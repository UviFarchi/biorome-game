import {requirements} from "@/rules/requirements.js";

/**
 * Returns a flat array of required modules (as strings) for a given product.
 * @returns {Array<String>}
 * @param {String} requirementType
 * @param {String} requirementName
 */
function getRequiredModules(requirementType, requirementName) {
    const reqs = requirements[requirementType][requirementName];
    if (!reqs) return [];
    return reqs.map(req => req.type + (req.subtype ? ` (${req.subtype})` : ''));
}


/**
 * Checks if the given assembly meets ALL requirementType in a list.
 * Used for harvest, planting, moving, etc.
 * @param {Object} assembly
 * @param {String} requirementType
 * @param {String}requirementName
 * @returns {Boolean}
 */
function assemblyMeetsRequirements(assembly, requirementType, requirementName) {
    console.log(assembly, requirementType, requirementName)
    let localRequirements = requirements[requirementType][requirementName]
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
 * @param {String} requirementType
 * @param {String} requirementName
 * @returns {Array<String>}
 */
function getMissingModules(assembly, requirementType, requirementName) {
    let localRequirements = requirements[requirementType][requirementName]
    if (!assembly || !assembly.modules) {
        return localRequirements.map(req => req.name || req.type || JSON.stringify(req))
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
    const reqs = requirements.harvest[productType];
    if (!reqs) return false
    const assembly = tile.assemblies.find(a => a.id === assemblyId)
    return assembly && assemblyMeetsRequirements(assembly, "harvest", productType)
}

/**
 * Returns a list of assemblies from the given array that can harvest this animal product now.
 * @param {Object} animal - The animal being harvested from.
 * @param {Object} animalProduct - The product object for this animal.
 * @param {Array<Object>} assemblies - Array of assemblies to check (tile or pool).
 * @param {Number} today - Current game day.
 * @returns {Array<Object>} - Array of eligible assemblies.
 */
function canHarvestAnimalProduct(animal, animalProduct, assemblies, today) {
    if (!animal || !animalProduct || !assemblies?.length) return []
    const reqs = requirements.harvest[animalProduct.key]
    if (!reqs) return []
    if (typeof animal.nextHarvest === "undefined") animal.nextHarvest = today

    // Return only assemblies that satisfy requirements and have actions left and are ready
    return assemblies.filter(a =>
        a.actions > 0 &&
        assemblyMeetsRequirements(a, "harvest", animalProduct.key) &&
        today >= animal.nextHarvest
    )
}

/**
 * Rule: Can this assembly harvest this animal now?
 * @param {Object} tile
 * @param {String} assemblyId
 * @returns {Boolean}
 */
function canHarvestAnimal(tile, assemblyId) {
    if (!tile.animal || !tile.assemblies) return false
    const animalType = tile.animal.type
    const reqs = requirements["harvest"][animalType]
    if (!reqs) return false
    const assembly = tile.assemblies.find(a => a.id === assemblyId)
    return assembly && assemblyMeetsRequirements(assembly, "harvest", animalType)
}

/**
 * Rule: Can this assembly plant this seed/seedling on a tile?
 * This is a pure requirementsType check, not a placement logic.
 * @param {Object} assembly
 * @param {'seed'|'seedling'} plantingType
 * @returns {Boolean}
 */
function canSowPlant(assembly, plantingType) {
    return assemblyMeetsRequirements(assembly, "sowing", plantingType)
}

/**
 * Rule: Can this assembly move an animal?
 * @param {Object} assembly
 * @returns {Boolean}
 */
function canMoveAnimal(assembly) {
    return assemblyMeetsRequirements(assembly, "animal", "move")
}

/**
 * Rule: Does this assembly qualify as a "collar assembly" for geofencing?
 * @param {Object} assembly
 * @returns {Boolean}
 */
function assemblyIsCollar(assembly) {
    return assemblyMeetsRequirements(assembly, "animal", "collar")
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
 * @param {Object} plant - the plant being sowed
 * @param {Array<Array<Object>>} tiles - 2D grid of all tiles
 * @returns {Array<{row: Number, col: Number}>}
 */
function validPlantDestTiles(plant, tiles) {
    if (!plant) return []

    return tiles.flat().filter(({row, col}) => !tiles[row][col].plant)
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


function getAdjacentTiles(tile, tilesGrid) {
    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ]
    const adj = []
    for (const [dr, dc] of dirs) {
        const row = tile.row + dr
        const col = tile.col + dc
        if (
            row >= 0 && row < tilesGrid.length &&
            col >= 0 && col < tilesGrid[0].length &&
            !(row === tile.row && col === tile.col)
        ) {
            adj.push(tilesGrid[row][col])
        }
    }
    return adj
}


export {
    assemblyMeetsRequirements,
    getMissingModules,
    canHarvestPlant,
    canHarvestAnimalProduct,
    canHarvestAnimal,
    canMoveAnimal,
    canSowPlant,
    assemblyIsCollar,
    validAnimalDestTiles,
    validPlantDestTiles,
    getMatchingModuleNames,
    getRequiredModules,
    getAdjacentTiles
}