module.exports = {
    // name of the creep type
    name: 'UPGRADER',
    amount: 1,

    body: {
        [WORK]: 3,
        [CARRY]: 3,
        [MOVE]: 6,
    },

    memory: {
        upgrading: false,
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading) {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller.pos);
                }
            } else {
                creep.memory.upgrading = false;
            }
        }
        else {
            creep.getEnergy();

            if(creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
                creep.memory.upgrading = true;
            }
        }
    }
};

