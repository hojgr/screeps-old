import { cost } from "../../utils/skills";

export const STATUS_GOING_TO_HARVEST = 0;
export const STATUS_HARVESTING = 1;
export const STATUS_WORKING = 2;

const SPAWN_NAME = "Spawn1";

export interface InitHashT {
    role: string;
    status: number;
}

export function run(creep: Creep, role: string, workingFn: (creep: Creep) => void): boolean {
    if (creep.memory.role !== role) {
        return false;
    }

    if (creep.memory.status === STATUS_WORKING && creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.status = STATUS_GOING_TO_HARVEST;
    } else if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.status = STATUS_WORKING;
    }

    let source = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);

    if (creep.memory.status === STATUS_GOING_TO_HARVEST) {
        creep.moveTo(source);

        if (creep.pos.isNearTo(source)) {
            creep.memory.status = STATUS_HARVESTING;
        }
    } else if (creep.memory.status === STATUS_HARVESTING) {
        creep.harvest(source);
    } else if (creep.memory.status === STATUS_WORKING) {
        workingFn(creep);
    }

    return true;
}

export function spawn(maxCreeps: number, role: string, skills: string[], initHash: InitHashT): boolean {
    if (_.filter(Game.creeps, isRole(role)).length >= maxCreeps) {
        return false;
    }

    let spawn = Game.spawns[SPAWN_NAME];

    if (spawn.energy >= cost(skills)) {
        spawn.createCreep(skills, undefined, initHash);
    }

    return true;
}

export function isRole(role: string): (creep: Creep) => boolean {
    return function(creep: Creep) {
        return creep.memory.role === role;
    };
}
