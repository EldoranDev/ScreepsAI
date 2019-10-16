require('./prototype.spawn');
require('./prototype.tower');
require('./prototype.creep');
require('./prototype.room');
require('./prototype.source');
require('./prototype.controller');

const config = require('./_config');

const ROLES = {};
const CREEP_NUMBERS = {};

for (const role of [
    require('./role.upgrader'),
    require('./role.harvester'),
    require('./role.remoteHarvester'),
    require('./role.builder'),
    require('./role.miner'),
    require('./role.trolley'),
]) {
    ROLES[role.name] = role;
    CREEP_NUMBERS[role.name] = role.amount;
}

const CREEP_TYPES = Object.keys(ROLES);

module.exports.loop = function loop() {
    if (Memory.cleanup <= 0 && Memory.creeps) {
        for (const name of Object.keys(Memory.creeps)) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        Memory.cleanup = config.TIMER.CLEAN_UP;
    }

    Memory.cleanup -= 1;

    for (const creep of Object.values(Game.creeps)) {
        ROLES[creep.memory.role].run(creep);
    }

    // Run Towers
    const towers = _.filter(Game.structures, (s) => s instanceof StructureTower);

    for (const tower of towers) {
        tower.run();
    }

    /** @var {Map<string, Creep[]>} sortedCreeps */
    const sortedCreeps = new Map();

    for (const type of CREEP_TYPES) {
        sortedCreeps
            .set(
                type,
                Object
                    .values(Game.creeps)
                    .filter((creep) => creep.memory.role === type),
            );
    }

    // Spawn new creeps if needed
    for (const type of CREEP_TYPES) {
        if (sortedCreeps.get(type).length < CREEP_NUMBERS[type]) {
            Game.spawns[config.SPAWNS.zion].spawn(ROLES[type]);
        }
    }

    for (const roomName of config.ROOMS) {
        const room = Game.rooms[roomName];
        const sources = room.getSources();
        if (!room.controller.hasContainers() && !room.controller.isBuildingContainer()) {
            room.controller.buildContainer();
        }

        for (const source of sources) {
            if (!source.hasContainer() && !source.isBuildingContainer()) {
                source.buildContainer();
            }
        }
    }

};
