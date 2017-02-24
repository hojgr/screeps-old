import * as BaseCreep from "./base";
import * as HarvestUpgrader from "./harvest_upgrader";
import { GameState } from "../../creep_manager";
import { _c } from "../../utils/spawn_util";
import * as Runner from "../phase2/runner";
import * as Miner from "../phase2/miner";

export const ROLE = "harvester";
const MAX_HARVESTERS = 6;
const SKILLS = [WORK, CARRY, MOVE, MOVE];
const INIT_HASH: BaseCreep.InitHashT = {role: ROLE, status: BaseCreep.STATUS_GOING_TO_HARVEST};

export function run(creep: Creep): boolean {
    return BaseCreep.run(creep, ROLE, function(c: Creep) {
        let storage = c.pos.findClosestByRange<Structure>(FIND_MY_STRUCTURES, {
            filter: function(s: StructureSpawn | StructureExtension) {
                return (s.structureType === STRUCTURE_SPAWN
                     || s.structureType === STRUCTURE_EXTENSION)
                     && s.energy < s.energyCapacity;
            },
        });

        if (storage === null) {
            HarvestUpgrader.forceRun(creep, true);
        } else {
            if (c.pos.isNearTo(storage)) {
                c.transfer(storage, RESOURCE_ENERGY);
            } else {
                c.moveTo(storage);
            }
        }
    });
}

export function spawn(spawn: Spawn, gameState: GameState): boolean {
    let runners = _c(gameState.memoryRoles, Runner.ROLE);
    let miners = _c(gameState.memoryRoles, Miner.ROLE);
    let harvesters = _c(gameState.memoryRoles, ROLE);

    let phaseCheck = gameState.spawnCapacity < Miner.MIN_ENERGY || runners == 0 || miners == 0

    if(phaseCheck && harvesters < MAX_HARVESTERS) {
        spawn.createCreep(SKILLS, "Harvester_" + Game.time, INIT_HASH);
        return true;
    }

    return false;
}
