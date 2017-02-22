import { cost } from "../utils/skills";

const STATUS_GOING_TO_HARVEST = 0;
const STATUS_HARVESTING = 1;
const STATUS_STORING_ENERGY = 2;

const ROLE = "harvester";
const SKILLS = [WORK, CARRY, MOVE, MOVE];
const SPAWN_NAME = "Spawn1";
const INIT_HASH = {status: STATUS_GOING_TO_HARVEST, role: ROLE};

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    if (creep.memory.status === STATUS_STORING_ENERGY && creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.status = STATUS_GOING_TO_HARVEST;
    } else if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.status = STATUS_STORING_ENERGY;
    }

    let source = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);

    if (creep.memory.status === STATUS_GOING_TO_HARVEST) {
        creep.moveTo(source);

        if (creep.pos.isNearTo(source)) {
            creep.memory.status = STATUS_HARVESTING;
        }
    } else if (creep.memory.status === STATUS_HARVESTING) {
        creep.harvest(source);
    } else if (creep.memory.status === STATUS_STORING_ENERGY) {
        let spawn = Game.spawns[SPAWN_NAME];

        creep.moveTo(spawn);

        if (creep.pos.isNearTo(spawn)) {
            creep.transfer(spawn, RESOURCE_ENERGY);
        }
    }

    return true;
}

export function spawn(): boolean {
    if(_.filter(Game.creeps, isHarvester).length >= 3)
        return false;

    let spawn = Game.spawns[SPAWN_NAME];

    if(spawn.energy >= cost(SKILLS)) {
        spawn.createCreep(SKILLS, undefined, INIT_HASH);
    }

    return true;
}

function isHarvester(creep: Creep) {
    return creep.memory.role == ROLE;
}
