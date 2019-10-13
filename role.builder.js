const roles = require('./_roles');
const config = require('./_config');

module.exports = {
    // name of the creep type
    name: roles.BUILDER,
    amount: 2,

    body: {
      [WORK]: 2,
      [CARRY]: 3,
      [MOVE]: 5,
    },

    memory: {
        working: false,
        builder: 0,
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.builder = 2;
        if (creep.memory.working === true) {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (creep.memory.builder > 0) {
                    creep.say("🔨");
                    creep.memory.builder--;

                    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                    if(targets.length) {
                        if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }

                        return;
                    }

                    // If there is nothing to repair and the builder is in build mode go and repair walls
                    // TODO: Remove if all our defenses are setup
                    const wall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < config.HEALTH_TARGETS.WALLS && s.structureType === STRUCTURE_WALL
                    });

                    if(creep.repair(wall) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(wall);
                    }

                } else {
                    const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) =>
                            s.hits / s.hitsMax < config.HEALTH_TARGETS.GENERAL
                            && s.hits < config.HEALTH_TARGETS.GENERAL_BOUND
                            && s.structureType !== STRUCTURE_WALL
                    });

                    if (structure) {
                        creep.say("🔧");
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
            creep.say("🔄⚡");
            if(creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
                creep.memory.working = true;
            }
        }
    }
};
