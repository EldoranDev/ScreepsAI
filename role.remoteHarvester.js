const config = require('./_config');
const roles = require('./_roles');
const BodyDefinition = require('./tools.bodydefinition');

module.exports = {
    name: roles.REMOTE_HARVESTER,

    amount: 2,

    body: new BodyDefinition(
        1,
        1,
    ),

    memory: {
        targetRoom: null,
        spawnRoom: null,
        delivering: false,
    },

    /** @param {Creep} creep * */
    run(creep) {
        if (!creep.memory.targetRoom) {
            const activeRemotes = _.filter(
                Game.creeps,
                (c) => c.memory.role === roles.REMOTE_HARVESTER,
            ).map((c) => c.memory.targetRoom);

            const available = _.filter(
                config.REMOTE_SOURCE_ROOMS,
                (room) => !activeRemotes.includes(room),
            );

            if (available.length > 0) {
                [creep.memory.targetRoom] = available;
                creep.memory.spawnRoom = creep.room.name;
            }
        }

        if (!creep.memory.delivering) {
            if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
                creep.memory.delivering = true;
                return;
            }

            if (creep.room.name === creep.memory.targetRoom) {
                const source = creep.pos.findClosestByPath(FIND_SOURCES);


                if (creep.pos.isNearTo(source)) {
                    creep.harvest(source);
                } else {
                    const { path } = PathFinder.search(creep.pos, source, {
                        maxRooms: 1,
                    });
                    creep.move(creep.pos.getDirectionTo(path[0]));
                }
            } else {
                creep.moveToRoom(creep.memory.targetRoom);
            }
        } else if (creep.room.name === creep.memory.spawnRoom) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.transfer(creep.room.storage, RESOURCE_ENERGY);
                creep.memory.delivering = false;
            } else {
                creep.moveTo(creep.room.storage);
            }
        } else {
            creep.moveToRoom(creep.memory.spawnRoom);
        }
    },
};
