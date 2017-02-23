import * as SpawnUtil from '../../utils/spawn_util';
import {isRole} from "../phase1/base";

export const ROLE = 'miner';

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    let source = Game.getObjectById<Source>(creep.memory.source);

    if(!source)
        return true;

    if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }

    return true;
}

export function spawn(): boolean {
    let minerCount = getMinerCount();

    if(minerCount >= getSourceCount()) {
        return false;
    }

    let initHash = {
        role: ROLE,
        source: ""
    };

    let source = getUnassignedSource();

    if(source) {
        initHash.source = source.id;
    }

    SpawnUtil.main().createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, initHash);

    return true;
}

function getMinerCount(): number {
    return _.filter(Game.creeps, isRole(ROLE)).length;
}

function getSourceCount() {
    return getSources().length;
}

function getSources(): Source[] {
    return SpawnUtil.main().room.find<Source>(FIND_SOURCES);
}

function getUnassignedSource(): Source | null {
    return SpawnUtil.main().pos.findClosestByRange<Source>(FIND_SOURCES, {
        filter: (s: Source) => {
            let isAvailable = true;

            for(let creepName in Game.creeps) {
                let creepMemory = Game.creeps[creepName].memory;

                if("source" in creepMemory && creepMemory.source == s.id) {
                    isAvailable = false;
                }
            }

            return isAvailable;
        }
    });
}
