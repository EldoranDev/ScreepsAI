class BodyDefinition {
    constructor(carry, work, balanceMove = true, scaling = { [MOVE]: true, [CARRY]: true, [WORK]: true}) {
        this.carry = carry;
        this.work = work;
        this.move = balanceMove ? (this.carry + this.work) : 1;
        this.scaling = scaling;
    }

    getBody(energy) {
        if ((!this.scaling[MOVE] && !this.scaling[CARRY] && !this.scaling[WORK]) || !energy) {
            return {
                [MOVE]: this.move,
                [CARRY]: this.carry,
                [WORK]: this.work,
            };
        }

        let multiplier = 0;

        for (let i = 2;;i += 1) {
            if (energy < (
                BODYPART_COST[MOVE] * (this.move * (this.scaling[MOVE] ? i : 1))
                + BODYPART_COST[CARRY] * (this.carry * (this.scaling[CARRY] ? i : 1))
                + BODYPART_COST[WORK] * (this.work * (this.scaling[WORK] ? i : 1))
            )) {
                multiplier = i - 1;
                break;
            }
        }

        return {
            [MOVE]: this.scaling[MOVE] ? this.move * multiplier : this.move,
            [CARRY]: this.scaling[CARRY] ? this.move * multiplier : this.carry,
            [WORK]: this.scaling[WORK] ? this.move * multiplier : this.work,
        };
    }
}

module.exports = BodyDefinition;
