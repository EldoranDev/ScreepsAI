
/**
 * Spawn a creep for the given Role
 *
 * @param role
 */
StructureSpawn.prototype.spawn = function (role) {
    const body = [];

    for(let part of Object.keys(role.body)) {
        body.push(...(Array(role.body[part]).fill(part)));
    }

    this.spawnCreep(body, `${role.name}-${Game.time}`, {
        memory: {
            role: role.name,
            ...role.memory,
        },
    });
};