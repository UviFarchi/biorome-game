import {defineStore} from 'pinia'
import {ref} from 'vue'

export const modulesStore = defineStore('modules', () => {
    const availableModules = ref(
        [
            // TRANSPORT & MOBILE BASES
            {
                name: "UGV Transport (small)",
                type: "transport",
                subtype: "ground",
                attachesTo: [],
                requires: ["battery"],
                slots: ["arm", "sensor", "camera", "cart", "tank", "sprayer", "seeder", "gps", "battery"],
                maxSlots: 6,
                powerDraw: 2,
                count: 0,
                cost: 200,
                actionsPerTurn: 1
            },
            {
                name: "UGV Transport (large)",
                type: "transport",
                subtype: "ground",
                attachesTo: [],
                requires: ["battery"],
                slots: ["arm", "sensor", "camera", "cart", "tank", "sprayer", "seeder", "gps", "battery"],
                maxSlots: 8,
                powerDraw: 3,
                count: 0, cost: 320,
                actionsPerTurn: 1
            },
            {
                name: "Drone Transport (quadcopter)",
                type: "transport",
                subtype: "flying",
                attachesTo: [],
                requires: ["battery"],
                slots: ["sensor", "camera", "sprayer", "tank", "battery", "gps"],
                maxSlots: 4,
                powerDraw: 2,
                count: 0, cost: 250,
                actionsPerTurn: 2
            },
            {
                name: "Drone Transport (fixed wing)",
                type: "transport",
                subtype: "flying",
                attachesTo: [],
                requires: ["battery"],
                slots: ["sensor", "camera", "sprayer", "tank", "battery", "gps"],
                maxSlots: 6,
                powerDraw: 3,
                count: 0, cost: 350,
                actionsPerTurn: 3
            },
            {
                name: "Rail Transport Module",
                type: "transport",
                subtype: "rail",
                attachesTo: [],
                requires: ["battery"],
                slots: ["cart", "sensor", "camera", "battery"],
                maxSlots: 4,
                powerDraw: 1,
                count: 0, cost: 150,
                actionsPerTurn: 1
            },
            {
                name: "Pole",
                type: "pole",
                subtype: null,
                attachesTo: [],
                requires: ["battery"],
                slots: ["sensor", "camera", "Communications"],
                maxSlots: 3,
                powerDraw: 0,
                count: 0, cost: 40,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Shelf/Rack",
                type: "shelf",
                subtype: null,
                attachesTo: [],
                requires: ["battery"],
                slots: ["arm", "sensor"],
                maxSlots: 2,
                powerDraw: 0,
                count: 0, cost: 35,
                actionsPerTurn: "unlimited"
            },

            // ROBOTIC ARMS
            {
                name: "Robotic Arm (small)",
                type: "arm",
                subtype: "small",
                attachesTo: ["transport", "pole", "shelf"],
                requires: ["transport"],
                slots: ["tool", "sensor"],
                maxSlots: 1,
                powerDraw: 1,
                count: 0, cost: 70,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Robotic Arm (medium)",
                type: "arm",
                subtype: "medium",
                attachesTo: ["transport", "pole", "shelf"],
                requires: ["transport"],
                slots: ["tool", "sensor"],
                maxSlots: 2,
                powerDraw: 1,
                count: 0, cost: 100,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Robotic Arm (heavy)",
                type: "arm",
                subtype: "heavy",
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: ["tool"],
                maxSlots: 1,
                powerDraw: 2,
                count: 0, cost: 160,
                actionsPerTurn: "unlimited"
            },

            // TOOLS & ATTACHMENTS
            {
                name: "Hole-Borer",
                type: "tool",
                subtype: "borer",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 40,
                actionsPerTurn: 3
            },
            {
                name: "Gripper",
                type: "tool",
                subtype: "gripper",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 30,
                actionsPerTurn: 3
            },
            {
                name: "Cutter/Saw",
                type: "tool",
                subtype: "cutter",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 35,
                actionsPerTurn: 3
            },
            {
                name: "Suction Tool",
                type: "tool",
                subtype: "suction",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 25,
                actionsPerTurn: 3
            },
            {
                name: "Seeder",
                type: "tool",
                subtype: "seeder",
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 45,
                actionsPerTurn: 3
            },
            {
                name: "Digger",
                type: "tool",
                subtype: "digger",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 50,
                actionsPerTurn: 3
            },
            {
                name: "Brush Tool",
                type: "tool",
                subtype: "brush",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 30,
                actionsPerTurn: 3
            },
            {
                name: "Rotating Blades",
                type: "tool",
                subtype: "rotatingblades",
                attachesTo: ["arm"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1.5,
                count: 0, cost: 45,
                actionsPerTurn: 3
            },
            {
                name: "Pitchfork",
                type: "tool",
                subtype: "pitchfork",
                attachesTo: ["arm", "internalspace"],
                requires: ["arm"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 28,
                actionsPerTurn: 2
            },

            // FIELD MODULES (CARRY/SPRAY/STORAGE)
            {
                name: "Cart",
                type: "cart",
                subtype: null,
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 60,
                actionsPerTurn: 1
            },
            {
                name: "Tank",
                type: "tank",
                subtype: null,
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 70,
                actionsPerTurn: 3
            },
            {
                name: "Sprayer",
                type: "sprayer",
                subtype: null,
                attachesTo: ["tank", "transport"],
                requires: ["tank", "transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 40,
                actionsPerTurn: 3
            },
            {
                name: "Fertilizer Spreader",
                type: "spreader",
                subtype: null,
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 45,
                actionsPerTurn: 3
            },
            {
                name: "Seed Box",
                type: "seedbox",
                subtype: null,
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 20,
                actionsPerTurn: 3
            },

            // SENSORS & MONITORING
            {
                name: "Sensor Module (soil)",
                type: "sensor",
                subtype: "soil",
                attachesTo: ["transport", "arm", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 30,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Sensor Module (air)",
                type: "sensor",
                subtype: "air",
                attachesTo: ["transport", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 30,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Sensor Module (leaf)",
                type: "sensor",
                subtype: "leaf",
                attachesTo: ["transport", "arm", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 35,
                actionsPerTurn: "unlimited"
            },
            {
                name: "pH Sensor",
                type: "sensor",
                subtype: "ph",
                attachesTo: ["transport", "arm", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 30,
                actionsPerTurn: "unlimited"
            },
            {
                name: "EC Sensor",
                type: "sensor",
                subtype: "ec",
                attachesTo: ["transport", "arm", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 35,
                actionsPerTurn: "unlimited"
            },
            {
                name: "NPK Sensor",
                type: "sensor",
                subtype: "npk",
                attachesTo: ["transport", "arm", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 35,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Weather Station",
                type: "weather",
                subtype: null,
                attachesTo: ["pole", "shelf"],
                requires: ["battery"],
                slots: ["sensor"],
                maxSlots: 2,
                powerDraw: 1,
                count: 0, cost: 60,
                actionsPerTurn: "unlimited"
            },

            // CAMERAS & IMAGING
            {
                name: "Camera Module (RGB)",
                type: "camera",
                subtype: "rgb",
                attachesTo: ["transport", "pole", "arm"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 50,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Camera Module (multispectral)",
                type: "camera",
                subtype: "ms",
                attachesTo: ["transport", "pole", "arm"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 70,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Camera Module (IR)",
                type: "camera",
                subtype: "ir",
                attachesTo: ["transport", "pole", "arm"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 65,
                actionsPerTurn: "unlimited"
            },

            // GPS / Communications / PROCESSING
            {
                name: "GPS Module",
                type: "gps",
                subtype: null,
                attachesTo: ["transport"],
                requires: ["transport"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 20,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Communications Repeater",
                type: "Communications",
                subtype: null,
                attachesTo: ["transport", "pole"],
                requires: ["battery"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 40,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Onboard Computer",
                type: "computer",
                subtype: null,
                attachesTo: ["transport", "pole"],
                requires: ["battery"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 120,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Solar Panel",
                type: "solar",
                subtype: null,
                attachesTo: ["pole", "shelf", "transport"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 50,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Battery Pack",
                type: "battery",
                subtype: null,
                attachesTo: ["transport", "pole"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 60,
                actionsPerTurn: "unlimited"
            },

            // SUPPLY / WASTE
            {
                name: "Mycelium Box",
                type: "box",
                subtype: null,
                attachesTo: ["cart"],
                requires: ["cart"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 18,
                actionsPerTurn: 1
            },
            {
                name: "Wagon Module",
                type: "wagon",
                subtype: null,
                attachesTo: ["rail"],
                requires: ["rail"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 80,
                actionsPerTurn: 1
            },
            {
                name: "Waste Module",
                type: "waste",
                subtype: null,
                attachesTo: ["cart"],
                requires: ["cart"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 15,
                actionsPerTurn: 1
            },

            // SPECIALS (can be left out for MVP, but here's for completeness)
            {
                name: "LED Lamp",
                type: "lamp",
                subtype: null,
                attachesTo: ["pole", "shelf"],
                requires: ["battery"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 35,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Heating Module",
                type: "heating",
                subtype: null,
                attachesTo: ["pole", "shelf", "transport"],
                requires: ["battery"],
                slots: [],
                maxSlots: 0,
                powerDraw: 2,
                count: 0, cost: 60,
                actionsPerTurn: "unlimited"
            },

            {
                name: "Valve module",
                type: "valve",
                subtype: null,
                attachesTo: ["tank", "pipe", "pole"],
                requires: ["tank"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.5,
                count: 0, cost: 35,
                actionsPerTurn: 1
            },
            {
                name: "Pump module",
                type: "pump",
                subtype: null,
                attachesTo: ["tank", "pipe", "pole"],
                requires: ["tank"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 60,
                actionsPerTurn: 1
            },
            {
                name: "Barrel module",
                type: "raincapture",
                subtype: null,
                attachesTo: [],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 55,
                actionsPerTurn: 1
            },
            {
                name: "Perimeter fence module",
                type: "fence",
                subtype: null,
                attachesTo: ["pole"],
                requires: ["pole"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 80,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Geofence Collar",
                type: "collar",
                subtype: null,
                attachesTo: [],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.2,
                count: 0, cost: 15,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Internal space module",
                type: "internalspace",
                subtype: null,
                attachesTo: ["shelf", "pole", "building"],
                requires: [],
                slots: [],
                maxSlots: 4,
                powerDraw: 0,
                count: 0, cost: 90,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Static actuator",
                type: "actuator",
                subtype: "static",
                attachesTo: ["internalspace"],
                requires: ["internalspace"],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 50,
                actionsPerTurn: 2
            },
            {
                name: "Sensor Module (temp)",
                type: "sensor",
                subtype: "temp",
                attachesTo: ["internalspace", "pole", "arm", "transport"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.3,
                count: 0, cost: 25,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Gas sensor module",
                type: "sensor",
                subtype: "gas",
                attachesTo: ["internalspace", "pole", "arm", "transport"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.3,
                count: 0, cost: 30,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Pressing module",
                type: "press",
                subtype: null,
                attachesTo: ["internalspace", "shelf"],
                requires: ["internalspace"],
                slots: [],
                maxSlots: 0,
                powerDraw: 2,
                count: 0, cost: 70,
                actionsPerTurn: 1
            },
            {
                name: "Generator module",
                type: "generator",
                subtype: null,
                attachesTo: ["internalspace", "pole"],
                requires: ["internalspace"],
                slots: [],
                maxSlots: 0,
                powerDraw: 0,
                count: 0, cost: 120,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Robotic Shelf",
                type: "shelf",
                subtype: "robotic",
                attachesTo: ["internalspace", "building"],
                requires: [],
                slots: ["arm", "sensor", "press"],
                maxSlots: 4,
                powerDraw: 1,
                count: 0, cost: 90,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Spore spreading module",
                type: "spreader",
                subtype: "spore",
                attachesTo: ["shelf", "internalspace"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 30,
                actionsPerTurn: 2
            },
            {
                name: "Heater/Humidifier module",
                type: "humidifier",
                subtype: null,
                attachesTo: ["internalspace", "shelf"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 40,
                actionsPerTurn: "unlimited"
            },
            {
                name: "Rotary plate module",
                type: "rotary",
                subtype: null,
                attachesTo: ["shelf", "pole", "internalspace"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.7,
                count: 0, cost: 60,
                actionsPerTurn: 1
            },
            {
                name: "Weighing module",
                type: "sensor",
                subtype: "weighing",
                attachesTo: ["cart", "arm", "shelf"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 0.2,
                count: 0, cost: 25,
                actionsPerTurn: 1
            },
            {
                name: "LIDAR module",
                type: "sensor",
                subtype: "lidar",
                attachesTo: ["transport", "arm", "pole", "drone"],
                requires: [],
                slots: [],
                maxSlots: 0,
                powerDraw: 1,
                count: 0, cost: 100,
                actionsPerTurn: 1
            }
        ]
    )

    const findModule = name => availableModules.value.find(m => m.name === name)
    const resolveModules = names => names
        .map(n => findModule(n))
        .filter(Boolean)
        .map(m => ({ ...m }))

    const premadeAssemblies =
        [
            // === Produce Cultivation (Field Zone) ===
            {
                usage: "Field Planter",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "GPS Module",
                    "Seeder",
                    "Robotic Arm (medium)",
                    "Hole-Borer",
                    "Camera Module (RGB)"
                ])
            },
            {
                usage: "Field Planter (seedlings)",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "GPS Module",
                    "Cart",
                    "Robotic Arm (medium)",
                    "Gripper",
                    "Camera Module (RGB)"
                ])
            },
            {
                usage: "Weeding Assembly (Cutter)",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "Camera Module (RGB)",
                    "Cutter/Saw"
                ])
            },
            {
                usage: "Weeding Assembly (Sprayer)",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "Camera Module (RGB)",
                    "Tank",
                    "Sprayer"
                ])
            },
            {
                usage: "Irrigation Assembly (Spot)",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "Tank",
                    "Sprayer",
                    "Camera Module (RGB)"
                ])
            },
            // Fixed field irrigation not an assembly, but could be a:
            {
                usage: "Field Irrigation Station",
                modules: resolveModules([
                    "Pole",
                    "Tank",
                    "Valve module",   // Note: Add to modules list if you want!
                    "Pump module"     // Note: Add to modules list if you want!
                ])
            },
            {
                usage: "Harvesting Assembly",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "GPS Module",
                    "Robotic Arm (medium)",
                    "Camera Module (RGB)",
                    "Gripper",
                    "Suction Tool",
                    "Cart"
                ])
            },
            // Sorting/grading is just extra modules on harvester:
            {
                usage: "Harvest Grader",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "GPS Module",
                    "Robotic Arm (medium)",
                    "Camera Module (RGB)",
                    "Weighing module",   // Add to modules list if desired
                    "Cart"
                ])
            },

            // === Land Modification ===
            {
                usage: "Path Construction",
                modules: resolveModules([
                    "UGV Transport (large)",
                    "Battery Pack",
                    "GPS Module",
                    "Digger",
                    "Flattener module",   // Add if needed
                    "Grader module"       // Add if needed
                ])
            },

            // === Rainwater Management ===
            {
                usage: "Rain Capture Station",
                modules: resolveModules([
                    "Barrel", // Add if needed
                    "Valve module",        // Add if needed
                    "Pump module"          // Add if needed
                ])
            },

            // === Habitat Management ===
            {
                usage: "Sensor Deployment UGV",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "Camera Module (RGB)",
                    "Sensor Module (soil)",
                    "GPS Module"
                ])
            },
            {
                usage: "Sensor Deployment Drone",
                modules: resolveModules([
                    "Drone Transport (quadcopter)",
                    "Battery Pack",
                    "Camera Module (RGB)",
                    "Sensor Module (air)",
                    "GPS Module"
                ])
            },
            {
                usage: "Fixed Sensor Pole",
                modules: resolveModules([
                    "Pole",
                    "Battery Pack",
                    "Sensor Module (soil)",
                    "Sensor Module (air)",
                    "Camera Module (RGB)"
                ])
            },
            {
                usage: "Sheep Monitor/Fence",
                modules: resolveModules([
                    "Pole",
                    "Battery Pack",
                    "Camera Module (RGB)",
                    "Communications Repeater"
                ])
            },

            {
                usage: "Poultry/Egg Collector",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "Camera Module (RGB)",
                    "Robotic Arm (small)",
                    "Suction Tool",
                    "Cart",
                    "Mycelium Box"
                ])
            },

            // === Bioreactor & Mycelium ===
            {
                usage: "Bioreactor Assembly",
                modules: resolveModules([
                    "Internal space module", // Add to list if you want
                    "Static actuator",       // Add to list if you want
                    "Heating Module",
                    "Sensor Module (temp)",
                    "pH Sensor",
                    "Gas sensor module",     // Add to list if you want
                    "Tank",
                    "Pressing module",       // Add to list if you want
                    "Generator module"       // Add to list if you want
                ])
            },
            {
                usage: "Mycelium Bricks Production",
                modules: resolveModules([
                    "Internal space module",   // Add to list if you want
                    "Robotic Shelf",
                    "Spore spreading module",  // Add to list if you want
                    "Heater/Humidifier module",// Add to list if you want
                    "Sensor Module (air)",
                    "Pressing module"          // Add to list if you want
                ])
            },

            // === Maintenance/Assembly ===
            {
                usage: "Module Assembly Station",
                modules: resolveModules([
                    "Robotic Shelf",
                    "Robotic Arm (heavy)",
                    "Rotary plate module",    // Add to list if you want
                    "Onboard Computer",
                    "Cart"
                ])
            },

            // === Infrastructure ===
            {
                usage: "Communications Backbone",
                modules: resolveModules([
                    "Pole",
                    "Battery Pack",
                    "Communications Repeater"
                ])
            },
            {
                usage: "Solar Charging Station",
                modules: resolveModules([
                    "Pole",
                    "Solar Panel",
                    "Battery Pack",
                    "Rotary plate module",   // Add to list if you want
                    "Onboard Computer"
                ])
            },

            // === Mapping/Monitoring Variants ===
            {
                usage: "Topographic Mapping UGV",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "GPS Module",
                    "Camera Module (RGB)",
                    "Sensor Module (soil)",
                    "LIDAR module"           // Add to list if you want
                ])
            },
            {
                usage: "Topographic Mapping Drone",
                modules: resolveModules([
                    "Drone Transport (quadcopter)",
                    "Battery Pack",
                    "GPS Module",
                    "Camera Module (RGB)",
                    "LIDAR module"           // Add to list if you want
                ])
            },

            // === Habitat & Sensor Deployment (LIDAR variant) ===
            {
                usage: "Habitat LIDAR Mapping",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "LIDAR module",
                    "Camera Module (RGB)",
                    "Sensor Module (soil)",
                    "GPS Module"
                ])
            },

            // === Harvest/Monitor (LIDAR add-on) ===
            {
                usage: "LIDAR Harvester",
                modules: resolveModules([
                    "UGV Transport (small)",
                    "Battery Pack",
                    "GPS Module",
                    "Robotic Arm (medium)",
                    "Camera Module (RGB)",
                    "LIDAR module",
                    "Gripper",
                    "Cart"
                ])
            }
        ];


    const activeAssemblies = ref(
        [
        {
            id: 'a6be11ee-e3a0-4189-baef-c59dcd4953b6',
            modules: resolveModules([
                "UGV Transport (small)",
                "Battery Pack",
                "LIDAR module",
                "Camera Module (RGB)",
                "Sensor Module (soil)",
                "GPS Module"
            ]),
            name: "Test A",
            deployed: false
        },        {
            id:'65012c5e-0ef3-488f-98e4-3a4366b3eb17',
            modules: resolveModules([
                "UGV Transport (small)",
                "Battery Pack",
                "Camera Module (RGB)",
                "Robotic Arm (small)",
                "Suction Tool",
                "Cart",
                "Mycelium Box"
            ]),
            name: "Test B",
            deployed: true
        },
    ]
    )

    const currentAssembly = ref([])
    return {availableModules, activeAssemblies, premadeAssemblies, currentAssembly}
})
