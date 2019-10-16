const roles = require('./_roles');
const config = require('./_config');

module.exports = {
    // name of the creep type
    name: roles.BUILDER,
    amount: 1,

    body: {
        [WORK]: 1,
        [CARRY]: 1,
        [MOVE]: 2,
    },

    memory: {
        working: false,
        builder: 0,
    },

    /** @param {Creep} creep * */
    run(creep) {
        if (creep.memory.working === true) {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (creep.memory.builder > 0) {
                    creep.say('🔨');
                    creep.memory.builder -= 1;

                    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                    if (targets.length) {
                        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }

                        return;
                    }

                    creep.moveTo(creep.pos.findClosestByPath(FIND_FLAGS, {
                        filter: (f) => f.name === config.FLAGS.PARKING,
                    }));
                } else {
                    const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits / s.hitsMax < config.HEALTH_TARGETS.GENERAL
                            && s.hits < config.HEALTH_TARGETS.GENERAL_BOUND
                            && s.structureType !== STRUCTURE_WALL,
                    });

                    if (structure) {
                        creep.say('🔧');
                        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveTo(structure);
                        }
                    } else {
                        creep.memory.builder = 200;
                    }
                }
            } else {
                creep.memory.working = false;
            }
        } else {
            creep.getEnergy();
            creep.say('🔄⚡');
            if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
                creep.memory.working = true;
            }
        }
    },
};
