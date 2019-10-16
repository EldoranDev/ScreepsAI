const roles = require('./_roles');

module.exports = {
    // name of the creep type
    name: roles.UPGRADER,
    amount: 3,

    body: {
        [WORK]: 1,
        [CARRY]: 1,
        [MOVE]: 2,
    },

    memory: {
        upgrading: false,
        hasEnergy: false,
    },

    /** @param {Creep} creep * */
    run(creep) {
        if (creep.memory.upgrading) {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                creep.say('🌟');
            } else {
                if (!creep.room.controller.hasContainers()) {
                    creep.getEnergy();
                    return;
                }

                const containers = _.filter(
                    creep.pos.lookFor(LOOK_STRUCTURES),
                    (s) => s instanceof StructureContainer,
                );

                if (containers.length === 0) {
                    creep.say('‼');
                }

                /**
                 * @var {StructureContainer} container
                 */
                const container = containers[0];

                if (container.store[RESOURCE_ENERGY] === 0) {
                    creep.say('Need ⚡');
                } else {
                    creep.withdraw(container, RESOURCE_ENERGY);
                }
            }
        } else {
            if (creep.room.controller.hasContainers()) {
                const container = _.filter(
                    creep.pos.lookFor(LOOK_STRUCTURES),
                    (s) => s instanceof StructureContainer,
                );

                if (container.length !== 0) {
                    if (creep.pos.isNearTo(creep.room.controller)) {
                        creep.memory.upgrading = true;
                    }
                } else {
                    const containers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: (s) => s.pos.lookFor(LOOK_CREEPS).length === 0,
                    });

                    if (containers.length === 0) {
                        creep.say('❗️🔋');
                    } else {
                        creep.moveTo(containers[0]);
                        creep.say(' 🚂🔋');
                    }
                }
            } else {
                if (creep.pos.isNearTo(creep.room.controller)) {
                    creep.memory.upgrading = true;
                } else {
                    creep.moveTo(creep.room.controller.pos);
                }
            }
        }
    },
};
