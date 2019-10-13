const ROLES = require('./_roles');

module.exports = {
    // name of the creep type
    name: ROLES.MINER,
    // Number of creeps
    amount: 2,

    body: {
        [MOVE]: 1,
        [WORK]: 5,
    },

    memory: {
        container: null,
    },

    /** @param {Creep} creep * */
    run(creep) {
        if (creep.memory.container) {
            const pos = new RoomPosition(
                creep.memory.container.x,
                creep.memory.container.y,
                creep.memory.container.roomName,
            );

            if (creep.pos.isEqualTo(pos)) {
                const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                creep.say('⛏');
                creep.harvest(source);
            } else {
                creep.say('🚂');
                creep.moveTo(pos);
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES_ACTIVE);

            for (const source of sources) {
                const container = source.pos.findClosestByRange(FIND_STRUCTURES, {
                    // eslint-disable-next-line no-loop-func
                    filter: (s) => (
                        s instanceof StructureContainer
                        && s.pos.lookFor(LOOK_CREEPS).length === 0
                    ),
                });

                if (container) {
                    creep.memory.container = container.pos;
                    break;
                }

                creep.say('Could not find Container');
            }
        }
    },
};
