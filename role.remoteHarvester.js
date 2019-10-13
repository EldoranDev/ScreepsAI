const config = require('./_config');
const roles = require('./_roles');

module.exports = {
    name: roles.REMOTE_HARVESTER,

    amount: 0,

    body: {
        [WORK]: 3,
        [CARRY]: 3,
        [MOVE]: 6,
    },

    memory: {
        targetRoom: null,
        spawnRoom: null,
        delivering: false,
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.targetRoom) {
            if (!creep.memory.delivering) {
                if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
                    creep.memory.delivering = true;
                    return;
                }

                if (creep.room.name === creep.memory.targetRoom) {
                    const source = creep.pos.findClosestByPath(FIND_SOURCES);

                    if(creep.pos.isNearTo(source)) {
                        creep.harvest(source)
                    } else {
                        creep.moveTo(source);
                    }
                } else {
                    creep.moveToRoom(creep.memory.targetRoom);
                }
            } else {
                if (creep.room.name === creep.memory.spawnRoom) {
                    const target = creep.findDeposit(true);

                    if (creep.pos.isNearTo(target)) {
                        creep.transfer(target, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(target);
                    }

                    if(creep.carry[RESOURCE_ENERGY] === 0) {
                        creep.memory.delivering = false;
                    }
                } else {
                    creep.moveToRoom(creep.memory.spawnRoom);
                }
            }
        } else {
            const activeRemotes = _.filter(Game.creeps, (creep) => {
                creep.memory.name = roles.REMOTE_HARVESTER;
            }).map(creep => creep.memory.targetRoom);

            const available = _.filter(config.REMOTE_SOURCE_ROOMS, room => !activeRemotes.includes(room));

            if(available.length > 0) {
                creep.memory.targetRoom = available[0];
                creep.memory.spawnRoom = creep.room.name;
            }
        }
    }
};
