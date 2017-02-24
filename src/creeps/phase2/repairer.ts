import { GameState } from "../../creep_manager";
import * as Runner from "./runner";
import { _c, main } from "../../utils/spawn_util";
import { getStorage } from "../../utils/energy";

export const ROLE = "repairer";

const MAX_REPAIRERS = 2;
const STATUS_GETTING_ENERGY = 0;
const STATUS_REPAIRING = 1;

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    if (creep.memory.status === STATUS_GETTING_ENERGY && creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.status = STATUS_REPAIRING;
    } else if (creep.memory.status === STATUS_REPAIRING && creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.status = STATUS_GETTING_ENERGY;
    }

    if (creep.memory.status === STATUS_GETTING_ENERGY) {
        let storage = getStorage(creep);

        if (storage && creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    } else if (creep.memory.status === STATUS_REPAIRING) {
        let toRepair = creep.pos.findClosestByRange<Structure>(FIND_STRUCTURES, {
            filter: (s: Structure) => (s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART)
                                   && s.hits < s.hitsMax
        })

        if (toRepair !== null) {
            if (creep.repair(toRepair) === ERR_NOT_IN_RANGE) {
                creep.moveTo(toRepair);
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

    let repairers = _c(gameState.memoryRoles, ROLE);

    if(storageAvailable && runners > 0 && repairers < MAX_REPAIRERS) {
        spawn.createCreep(
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            "Repairer_" + Game.time,
            {role: ROLE, status: STATUS_GETTING_ENERGY}
        );

        return true;
    }

    return false;
}
