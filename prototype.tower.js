const config = require('./_config');

StructureTower.prototype.run = function run() {
    const enemy = this.pos.findClosestByRange(FIND_CREEPS, {
        filter: (c) => !c.my,
    });

    if (enemy) {
        this.attack(enemy);
        return;
    }

    const wall = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => (
            s instanceof StructureWall
            || s instanceof StructureRampart
        ) && s.hits < s.hitsMax && s.hits < config.HEALTH_TARGETS.WALLS,
    });

    if (wall) {
        this.repair(wall);
    }
};
