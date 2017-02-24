import * as SpawnUtil from "../../utils/spawn_util";

const ROLE = "upgrader";

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

function getStorage(creep: Creep): StructureStorage | StructureContainer | null {
    let container = creep.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
                                                                    // to prevent walking to almost empty container
        filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 50,
    });

    if (container) {
        return container;
    }

    let storage = creep.pos.findClosestByRange<StructureStorage>(FIND_MY_STRUCTURES, {
                                                                    // to prevent walking to almost empty container
        filter: (s: StructureStorage) => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 50,
    });

    if (storage) {
        return storage;
    }

    return null;
}

export function spawn(maxCreeps: number) {
    if (_.filter(Game.creeps, (c: Creep) => c.memory.role === ROLE).length >= maxCreeps) {
        return false;
    }

    SpawnUtil.main().createCreep(
        [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        undefined,
        {role: ROLE, status: STATUS_GETTING_ENERGY}
    );
}
