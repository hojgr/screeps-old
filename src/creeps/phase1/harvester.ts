import * as BaseCreep from "./base";

export const ROLE = "harvester";
const SKILLS = [WORK, CARRY, MOVE, MOVE];
const INIT_HASH: BaseCreep.InitHashT = {role: ROLE, status: BaseCreep.STATUS_GOING_TO_HARVEST};

export function run(creep: Creep): boolean {
    BaseCreep.run(creep, ROLE, function(c: Creep) {
        let storage = c.pos.findClosestByRange<Structure>(FIND_MY_STRUCTURES, {
            filter: function(s: StructureSpawn | StructureExtension) {
                return (s.structureType === STRUCTURE_SPAWN
                     || s.structureType === STRUCTURE_EXTENSION)
                     && s.energy < s.energyCapacity;
            },
        });

        if (storage === null) {
            let meetingFlag = c.pos.findClosestByRange<Flag>(FIND_FLAGS, {
                filter: function(f: Flag) {
                    return f.name.indexOf("Meeting") === 0;
                },
            });

            if (meetingFlag) {
                c.moveTo(meetingFlag);
            } else {
                console.log("No meeting flag!!!");
            }
        } else {
            if (c.pos.isNearTo(storage)) {
                c.transfer(storage, RESOURCE_ENERGY);
            } else {
                c.moveTo(storage);
            }
        }
    });

    return true;
}

export function spawn(maxCreeps: number): boolean {
    return BaseCreep.spawn(maxCreeps, ROLE, SKILLS, INIT_HASH);
}
