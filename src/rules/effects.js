const effects = {
    // FERTILITY & SOIL
    fertilizer: {
        property: 'fertility',
        delta: 1, // or set per animal/plant
        description: 'Increases soil fertility'
    },
    soil_loosen: {
        property: 'compaction',
        delta: -1,
        description: 'Loosens soil and improves aeration'
    },

    // WATER
    water_consumption: {
        property: 'water',
        delta: -1, // Consumed per turn by plant/animal
        description: 'Reduces soil water'
    },

    // PEST CONTROL
    pest_control: {
        property: 'pests',
        delta: -1, // Or set to -effect.strength
        description: 'Reduces pests on this tile and nearby tiles'
    },

    // POLLINATION
    pollination: {
        property: 'pollination',
        delta: 1,
        description: 'Boosts pollination, increases fruit/seed yield'
    },

    // DEFENSE
    defense: {
        property: 'defense',
        delta: 1,
        description: 'Protects from negative events, theft, or predators'
    },

    // WEEDS
    weed_suppression: {
        property: 'weeds',
        delta: -1,
        description: 'Suppresses weeds on tile'
    },

    // NITROGEN FIXING (if you add, e.g., clover/legumes)
    nitrogen_fixing: {
        property: 'fertility',
        delta: 1,
        description: 'Increases soil nitrogen naturally'
    },

    // POLYCULTURE/SYMBIOSIS (for certain combinations)
    synergy: {
        property: 'yield',
        delta: 1,
        description: 'Boosts yield or resistance due to symbiosis'
    },

    // SURPRISE (for donkey Easter egg, can be handled in events or news)
    surprise: {
        property: null,
        delta: null,
        description: 'Does something fun or unexpected'
    },
    ph_up: {
        property: 'ph',
        delta: 0.2,  // Increases soil pH (less acidic)
        description: 'Raises soil pH'
    },
    ph_down: {
        property: 'ph',
        delta: -0.2, // Decreases soil pH (more acidic)
        description: 'Lowers soil pH'
    },
}

export {effects}