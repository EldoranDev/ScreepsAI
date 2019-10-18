const ROLES = require('./_roles');
const BodyDefinition = require('./tools.bodydefinition');

module.exports = {
    // name of the creep type
    name: ROLES.TROLLEY,

    // Number of creeps
    amount: 4,

    body: new BodyDefinition(
        1,
        1,
    ),

    memory: {
        delivering: true,
    },

    /** @param {Creep} creep * */
    run(creep) {
        if (!creep.memory.delivering) {
            if (creep.carry.energy < creep.carryCapacity) {
                creep.say('🔄⚡');
                const energy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

                if (energy) {
                    if (creep.pickup(energy) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy);
                        return;
                    }
                }

                const container = creep.getEnergy(true);

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
            if (!target) {
                creep.say('💤');
            }

            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.say('🚂⚡');
                creep.moveTo(target);
            }

            if (creep.carry[RESOURCE_ENERGY] === 0) {
                creep.memory.delivering = false;
            }
        }
    },
};
