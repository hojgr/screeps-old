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

    BaseCreep.run(creep, role, function(c: Creep) {
        let controller = creep.room.controller;

        if (controller !== undefined) {
            c.moveTo(controller);

            if (c.pos.isNearTo(controller)) {
                c.transfer(controller, RESOURCE_ENERGY);
            }
        }
    });

    return true;
}

export function spawn(maxCreeps: number): boolean {
    return BaseCreep.spawn(maxCreeps, ROLE, SKILLS, INIT_HASH);
}
