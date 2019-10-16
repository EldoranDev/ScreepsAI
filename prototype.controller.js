/**
 * Return container that possibly is the dedicated container
 * @returns {StructureContainer[]}
 */
StructureController.prototype.getContainers = function getContainers() {
    this._containers = this.pos.findInRange(FIND_STRUCTURES, 1, {
        /** @param {Structure} s */
        filter: (s) => s.structureType === STRUCTURE_CONTAINER,
    });

    return this._containers;
};

/**
 * Checks if the source has a container
 * @returns {boolean}
 */
StructureController.prototype.hasContainers = function hasContainers() {
    this._hasContainer = this.getContainers().length > 0;
    return this._hasContainer;
};

StructureController.prototype.isBuildingContainer = function isBuildingContainer() {
    this._hasSite = this.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
        /** @param {ConstructionSite} cs */
        filter: (cs) => cs.structureType === STRUCTURE_CONTAINER,
    }).length > 0;

    return this._hasSite;
};

StructureController.prototype.buildContainer = function buildContainer() {
    const { x, y, roomName } = this.pos;

    /** @type {RoomPosition[]} */
    const positions = [
        new RoomPosition(x + 1, y - 1, roomName),
        new RoomPosition(x + 1, y, roomName),
        new RoomPosition(x + 1, y - 1, roomName),
        new RoomPosition(x, y - 1, roomName),
        new RoomPosition(x, y + 1, roomName),
        new RoomPosition(x - 1, y - 1, roomName),
        new RoomPosition(x - 1, y, roomName),
        new RoomPosition(x - 1, y - 1, roomName),
    ];

    /** @type {RoomPosition|null} */
    let nearest = null;
    /** @type {Array<RoomPosition>|null} */
    let nearestPath = null;
    let cost = Number.POSITIVE_INFINITY;

    const spawn = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_SPAWN,
    });

    /** @var {RoomPosition} pos */
    for (let i = 0; i < positions.length; i += 1) {
        const result = PathFinder.search(positions[i], spawn, {
            maxRooms: 1,
            plainCost: 1,
            swampCost: 1,
        });

        if (result.cost < cost) {
            cost = result.cost;
            nearest = positions[i];
            nearestPath = result.path;
        }
    }

    this.room.createConstructionSite(nearest.x, nearest.y, STRUCTURE_CONTAINER);

    for (let i = 0; i < nearestPath.length - 1; i += 1) {
        const pos = nearestPath[i];
        this.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
    }
};
