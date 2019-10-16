/**
 *
 * @param {boolean} onlyActive
 * @returns {Array<Source>}
 */
Room.prototype.getSources = function getSources(onlyActive = false) {
    return this.find(onlyActive ? FIND_SOURCES_ACTIVE : FIND_SOURCES);
};
