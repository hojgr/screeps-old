import { GameState } from "../../creep_manager";
import { getSourceCount, getUnassignedSource } from "../../utils/energy";
import { _c } from "../../utils/spawn_util";

export const ROLE = "miner";
export const MIN_ENERGY = 550;

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    let source = Game.getObjectById<Source>(creep.memory.source);

    if (!source) {
        return true;
    }

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }

    return true;
}

export function spawn(spawn: Spawn, gameState: GameState): boolean {
    if(gameState.spawnCapacity < MIN_ENERGY) {
        return false;
    }

    let minerCount = _c(gameState.memoryRoles, ROLE);

    if (minerCount >= getSourceCount()) {
        return false;
    }

    let initHash = {
        role: ROLE,
        source: "",
    };

    let source = getUnassignedSource();

    if (source) {
        initHash.source = source.id;
    }

    let name = spawn.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], "Miner_" + Game.time, initHash);

    return !(name < 0);
}
