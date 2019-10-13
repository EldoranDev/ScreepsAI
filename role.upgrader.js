module.exports = {
    // name of the creep type
    name: 'UPGRADER',
    amount: 1,

    body: {
        [WORK]: 4,
        [CARRY]: 43,
        [MOVE]: 1,
    },

    memory: {
        upgrading: false,
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading) {
            if(creep.carry[RESOURCE_ENERGY] > 0) {
                creep.upgradeController(creep.room.controller);
                creep.say("🌟");
            } else {
                const containers = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), s => s instanceof StructureContainer);

                if(containers.length === 0) {
                    creep.say("‼");
                }

                /**
                 * @var {StructureContainer} container
                 */
                const container = containers[0];

                if(container.store[RESOURCE_ENERGY] === 0) {
                    creep.say("Need ⚡");
                } else {
                    creep.withdraw(container, RESOURCE_ENERGY);
                }
            }
        } else {
            const container = _.filter(creep.pos.lookFor(LOOK_STRUCTURES), s => s instanceof StructureContainer);

            if(container.length !== 0) {
                if (creep.pos.isNearTo(creep.room.controller)) {
                    creep.memory.upgrading = true;
                }
            } else {
                const containers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.pos.lookFor(LOOK_CREEPS).length === 0,
                });

                if (containers.length === 0) {
                    creep.say("No emtpy upgrade container");
                } else {
                    creep.moveTo(containers[0]);
                }
            }
        }
    }
};

