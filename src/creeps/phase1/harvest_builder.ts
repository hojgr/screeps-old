import * as BaseCreep from "./base";

export const ROLE = "harvestBuilder";
const SKILLS = [WORK, CARRY, MOVE, MOVE];
const SPAWN_NAME = "Spawn1";
const INIT_HASH: BaseCreep.InitHashT = {role: ROLE, status: BaseCreep.STATUS_GOING_TO_HARVEST};

export function run(creep: Creep): boolean {
    BaseCreep.run(creep, ROLE, function(c: Creep) {
        let constructionSite = c.pos.findClosestByRange<ConstructionSite>(FIND_CONSTRUCTION_SITES);

        if (constructionSite !== undefined) {
            if (c.build(constructionSite) === ERR_NOT_IN_RANGE) {
                c.moveTo(constructionSite);
            }
        }
    });

    return true;
}

export function spawn(maxCreeps: number): boolean {
    if (Game.spawns[SPAWN_NAME].room.find(FIND_CONSTRUCTION_SITES).length) {
        return BaseCreep.spawn(maxCreeps, ROLE, SKILLS, INIT_HASH);
    }

    return false;
}
