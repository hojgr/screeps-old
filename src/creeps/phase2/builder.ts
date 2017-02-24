import { GameState } from "../../creep_manager";
import * as Runner from "./runner";
import { _c, main } from "../../utils/spawn_util";
import * as Building from "../../utils/building";
import { getStorage } from "../../utils/energy";

export const ROLE = "builder";

const MAX_BUILDERS = 6;
const STATUS_GETTING_ENERGY = 0;
const STATUS_UPGRADING = 1;

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    if (creep.memory.status === STATUS_GETTING_ENERGY && creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.status = STATUS_UPGRADING;
    } else if (creep.memory.status === STATUS_UPGRADING && creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.status = STATUS_GETTING_ENERGY;
    }

    if (creep.memory.status === STATUS_GETTING_ENERGY) {
        let storage = getStorage(creep);

        if (storage && creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    } else if (creep.memory.status === STATUS_UPGRADING) {
        let constructionSite = Building.findClosestBuildingWithPriority(creep);

        if (constructionSite !== null) {
            if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        } else {
            let spawn = main();

            if(spawn.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }

    return true;
}

export function spawn(spawn: Spawn, gameState: GameState): boolean {
    let storageAvailable = (gameState.storages.containers.length > 0 || gameState.storages.storages.length > 0) ? true : false;
    let runners = _c(gameState.memoryRoles, Runner.ROLE);

    let builders = _c(gameState.memoryRoles, ROLE);

    let constructionSiteCount = spawn.room.find(FIND_CONSTRUCTION_SITES).length;

    if(storageAvailable && runners > 0 && constructionSiteCount && builders < MAX_BUILDERS) {
        spawn.createCreep(
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            "Builder_" + Game.time,
            {role: ROLE, status: STATUS_GETTING_ENERGY}
        );

        return true;
    }

    return false;
}
