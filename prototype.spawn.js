/**
 * Spawn a creep for the given Role
 *
 * @param role
 */
StructureSpawn.prototype.spawn = function spawn(role) {
    const body = [];

    const parts = role.body.getBody(this.room.energyCapacityAvailable);

    for (const part of Object.keys(parts)) {
        body.push(...(Array(parts[part]).fill(part)));
    }

    this.spawnCreep(body, `${role.name}-${Game.time}`, {
        memory: {
            role: role.name,
            ...role.memory,
        },
    });
};
