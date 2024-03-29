import { GameState } from "../../creep_manager";
import * as Runner from "./runner";
import { _c } from "../../utils/spawn_util";
import { getStorage } from "../../utils/energy";

export const ROLE = "upgrader";

const MAX_UPGRADERS = 6;
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
        let controller = creep.room.controller;

        if (controller &&  creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
        }
    }

    return true;
}

export function spawn(spawn: Spawn, gameState: GameState): boolean {
    let storageAvailable = (gameState.storages.containers.length > 0 || gameState.storages.storages.length > 0) ? true : false;
    let runners = _c(gameState.memoryRoles, Runner.ROLE);

    if(runners > 0 && storageAvailable && MAX_UPGRADERS > _c(gameState.memoryRoles, ROLE)) {
        spawn.createCreep(
            [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            "Upgrader_" + Game.time,
            {role: ROLE, status: STATUS_GETTING_ENERGY}
        );

        return true;
    }

    return false;
}
