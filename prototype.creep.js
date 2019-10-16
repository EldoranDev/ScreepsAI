const roles = require('./_roles');

/**
 * Find a container that can get used as energy source
 * Only searches in the current room
 *
 * @returns {StructureContainer|null}
 */
Creep.prototype.findEnergyContainer = function findEnergyContainer() {
    let containers = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            if (structure.structureType === STRUCTURE_CONTAINER) {
                return _.filter(
                    structure.pos.lookFor(LOOK_CREEPS),
                    (c) => c.memory.role === roles.MINER,
                ).length > 0;
            }

            return false;
        },
    });

    if (containers.length === 0) {
        return null;
    }

    if (containers.length !== 1) {
        containers = _.filter(containers, (c) => c.store);
        containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
    }

    return containers[0];
};

Creep.prototype.findDropedEnergy = function findDropedEnergy() {
    // TODO: Make compatible with materials
    const dropedEnergy = this.room.find(FIND_DROPPED_RESOURCES);

    if (dropedEnergy.length === 0) {
        return null;
    }

    if (dropedEnergy.length > 1) {
        dropedEnergy.sort((a, b) => b.amount - a.amount);
    }

    return dropedEnergy[0];
};

Creep.prototype.getEnergy = function getEnergy(preferMine = false) {
    if (!preferMine && this.room.storage && this.room.storage.store[RESOURCE_ENERGY] >= 0) {
        if (this.pos.isNearTo(this.room.storage)) {
            this.withdraw(this.room.storage, RESOURCE_ENERGY);
        } else {
            this.moveTo(this.room.storage);
        }
        return;
    }

    const container = this.findEnergyContainer();

    if (container && container.store[RESOURCE_ENERGY] > 0) {
        if (this.pos.isNearTo(container)) {
            this.withdraw(container, RESOURCE_ENERGY);
        } else {
            this.moveTo(container);
        }

        return;
    }

    const energy = this.findDropedEnergy();

    if (energy) {
        if (this.pos.isNearTo(energy) || this.pos.isEqualTo(energy)) {
            this.pickup(energy);
        } else {
            this.moveTo(energy);
        }

        return;
    }

    if (this.room.storage && this.room.storage.store[RESOURCE_ENERGY] >= 0) {
        if (this.pos.isNearTo(this.room.storage)) {
            this.withdraw(this.room.storage, RESOURCE_ENERGY);
        } else {
            this.moveTo(this.room.storage);
        }

        return;
    }

    const source = this.room.getSources()[0];

    if (this.harvest(source) === ERR_NOT_IN_RANGE) {
        this.moveTo(source);
    }
};

/**
 * Move to the given Exit
 *
 * @param {string|Room} room Start room name or room object.
 * @see {@link http://support.screeps.com/hc/en-us/articles/203079191-Map#findExit}
 */
Creep.prototype.moveToRoom = function moveToRoom(room) {
    const exit = Game.map.findExit(this.room, room);
    this.moveTo(this.room.find(exit)[0]);
};

/**
 * Find a place to put energy into
 * @return {StructureStorage|StructureTower|StructureSpawn|StructureExtension|null}
 */
Creep.prototype.findDeposit = function findDeposit(forceQuick = false) {
    if (forceQuick && this.room.storage) {
        return this.room.storage;
    }

    let deposit = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => (
            structure instanceof StructureSpawn
            || structure instanceof StructureExtension
            || structure instanceof StructureTower
        ) && structure.energy < structure.energyCapacity,
    });

    if (deposit) {
        return deposit;
    }

    deposit = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            if (!(structure instanceof StructureContainer)) {
                return false;
            }

            if (_.filter(
                structure.pos.lookFor(LOOK_CREEPS),
                (c) => c.memory.role === roles.UPGRADER,
            ).length !== 1) {
                return false;
            }

            return !(structure.store[RESOURCE_ENERGY] === structure.storeCapacity);
        },
    });

    if (deposit) {
        return deposit;
    }

    return this.room.storage;
};