const infos = require('./_config');

module.exports = {
  // name of the creep type
  name: 'HARVESTER',
  // Number of creeps
  amount: 0,

  body: {
    [WORK]: 2,
    [CARRY]: 2,
    [MOVE]: 4,
  },

  memory: {
    delivering: true,
  },

  /** @param {Creep} creep * */
  run(creep) {
    if (!creep.memory.delivering) {
      if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.delivering = true;
        return;
      }
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

      if (creep.pos.isNearTo(source)) {
        creep.harvest(source);
      } else {
        creep.moveTo(source);
      }
    } else {
      const target = creep.findDeposit();

      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }

      if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.delivering = false;
      }
    }
  },
};
