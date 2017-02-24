import { getNotFullStorage } from "../../utils/energy";
import { _c } from "../../utils/spawn_util";
import * as Runner from "./runner";
import { GameState } from "../../creep_manager";

export const ROLE = "cleaner";
const MAX_CLEANERS = 1;

const STATUS_COLLECTING = 0;
const STATUS_STORING = 1;

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.status = STATUS_STORING;
    } else if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.status = STATUS_COLLECTING;
    }

    if (creep.memory.status === STATUS_COLLECTING) {
        let allDroppedEnergy = creep.room.find<Resource>(FIND_DROPPED_ENERGY);

        if(allDroppedEnergy.length) {
            let highestEnergy: Resource = allDroppedEnergy[0];

            for(let e of allDroppedEnergy) {
                if(e.amount > highestEnergy.amount) {
                    highestEnergy = e;
                }
            }

            if(creep.pickup(highestEnergy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(highestEnergy);
            }
        }
    } else if (creep.memory.status === STATUS_STORING) {
        let storage = getNotFullStorage(creep);

        if (storage && creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    }

    return true;
}

export function spawn(spawn: Spawn, gameState: GameState): boolean {
    let runners = _c(gameState.memoryRoles, Runner.ROLE);

    if(runners > 0 && MAX_CLEANERS > _c(gameState.memoryRoles, ROLE)) {
        spawn.createCreep([
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE,  MOVE,  MOVE,  MOVE,  MOVE,
        ], "Cleaner_" + Game.time, {
            role: ROLE,
            status: STATUS_COLLECTING,
        });

        return true;
    }

    return false;
}
