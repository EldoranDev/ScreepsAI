
/**
 * Spawn a creep for the given Role
 *
 * @param role
 */
StructureSpawn.prototype.spawn = function spawn(role) {
    const body = [];

    for (const part of Object.keys(role.body)) {
        body.push(...(Array(role.body[part]).fill(part)));
    }

    this.spawnCreep(body, `${role.name}-${Game.time}`, {
        memory: {
            role: role.name,
            ...role.memory,
        },
    });
};
