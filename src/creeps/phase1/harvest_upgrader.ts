import * as BaseCreep from "./base";

export const ROLE = "harvestUpgrader";
const SKILLS = [WORK, CARRY, MOVE, MOVE];
const INIT_HASH: BaseCreep.InitHashT = {role: ROLE, status: BaseCreep.STATUS_GOING_TO_HARVEST};

export function run(creep: Creep): boolean {
    return forceRun(creep, false);
}

export function forceRun(creep: Creep, force: boolean): boolean {
    let role = ROLE;

    if (force) {
        role = creep.memory.role; // workaround
    }

    return BaseCreep.run(creep, role, function(c: Creep) {
        let controller = creep.room.controller;

        if (controller !== undefined) {
            if (c.transfer(controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                c.moveTo(controller);
            }

        }
    });
}

export function spawn(maxCreeps: number): boolean {
    return BaseCreep.spawn(maxCreeps, ROLE, SKILLS, INIT_HASH);
}
