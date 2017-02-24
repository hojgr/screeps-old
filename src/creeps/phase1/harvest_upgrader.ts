import * as BaseCreep from "./base";
import { GameState } from "../../creep_manager";
import { _c } from "../../utils/spawn_util";
import * as Upgrader from "../phase2/upgrader";

export const ROLE = "harvestUpgrader";
const MAX_HARVEST_UPGRADERS = 3;
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

export function spawn(spawn: Spawn, gameState: GameState) {
    let upgraders = _c(gameState.memoryRoles, Upgrader.ROLE); // TBA
    let harvestUpgraders = _c(gameState.memoryRoles, ROLE);

    if(upgraders === 0 && harvestUpgraders < MAX_HARVEST_UPGRADERS) {
        spawn.createCreep(SKILLS, "HarvestUpgrader_" + Game.time, INIT_HASH);

        return true;
    }

    return false;
}
