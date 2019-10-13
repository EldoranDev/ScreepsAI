const ROLES = require('./_roles');

module.exports = {
    // name of the creep type
    name: ROLES.TROLLEY,

    // Number of creeps
    amount: 2,

    body: {
        [CARRY]: 4,
        [MOVE]: 4,
    },

    memory: {
        delivering: true,
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.delivering) {
            if (creep.carry.energy < creep.carryCapacity) {
                const energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

                if (energy) {
                    if (creep.pickup(energy) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy);
                        return;
                    }
                }

                const container = creep.findEnergyContainer();

                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            } else {
                creep.memory.delivering = true;
            }
        } else {
            const target = creep.findDeposit();

            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

            if(creep.carry[RESOURCE_ENERGY] === 0) {
                creep.memory.delivering = false;
            }
        }
    }
};

