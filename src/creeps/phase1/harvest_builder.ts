import * as BaseCreep from "./base";
import { GameState } from "../../creep_manager";
import { _c, main } from "../../utils/spawn_util";
import * as Building from "../../utils/building";
import * as Builder from "../phase2/builder";

export const ROLE = "harvestBuilder";
const MAX_HARVEST_BUILDERS = 6;
const SKILLS = [WORK, CARRY, MOVE, MOVE];
const INIT_HASH: BaseCreep.InitHashT = {role: ROLE, status: BaseCreep.STATUS_GOING_TO_HARVEST};

export function run(creep: Creep): boolean {
    return BaseCreep.run(creep, ROLE, function(c: Creep) {
        let constructionSite = Building.findClosestBuildingWithPriority(c);

        if (constructionSite !== null) {
            if (c.build(constructionSite) === ERR_NOT_IN_RANGE) {
                c.moveTo(constructionSite);
            }
        } else {
            let spawn = main();

            if(spawn.recycleCreep(c) === ERR_NOT_IN_RANGE) {
                c.moveTo(spawn);
            }
        }
    });
}

export function spawn(spawn: Spawn, gameState: GameState) {
    let builders = _c(gameState.memoryRoles, Builder.ROLE); // TBA
    let harvestBuilders = _c(gameState.memoryRoles, ROLE);

    let constructionSiteCount = spawn.room.find(FIND_CONSTRUCTION_SITES).length;

    if(builders === 0 && constructionSiteCount && harvestBuilders < MAX_HARVEST_BUILDERS) {
        spawn.createCreep(SKILLS, "HarvestBuilder_" + Game.time, INIT_HASH);
    }
}
