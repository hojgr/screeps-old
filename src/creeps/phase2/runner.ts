import * as Miner from "./miner";
import * as SpawnUtil from "../../utils/spawn_util";

export const ROLE = "runner";

const STATUS_COLLECTING = 0;
const STATUS_STORING = 1;

export function run(creep: Creep): boolean {
    if (creep.memory.role !== ROLE) {
        return false;
    }

    if (!(creep.memory.belongsTo in Game.creeps)) { // miner does not exist
        let availableMiner = findMinerWithoutRunner();

        if (!availableMiner) {
            return true;
        }

        creep.memory.belongsTo = availableMiner.name;
    }

    if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
        creep.memory.status = STATUS_STORING;
    } else if (creep.carry[RESOURCE_ENERGY] === 0) {
        creep.memory.status = STATUS_COLLECTING;
    }

    let miner = Game.creeps[creep.memory.belongsTo];

    if (creep.memory.status === STATUS_COLLECTING) {
        if (creep.pos.isNearTo(miner.pos)) {
            let energy = creep.pos.findInRange<Resource>(
                FIND_DROPPED_ENERGY,
                1
            );

            if (energy.length > 0) {
                creep.pickup(energy[0]);
            }
        } else {
            creep.moveTo(miner);
        }
    } else if (creep.memory.status === STATUS_STORING) {
        let spawnStorage: StructureSpawn | null = null;
        let extensionStorage: StructureExtension | null = null;
        let containerStorage: StructureContainer| null = null;
        let storageStorage: StructureStorage| null = null;

        creep.pos.findClosestByRange<StructureStorage>(FIND_STRUCTURES, {
            filter: (s: any) => {
                if (((s.store ? s.store[RESOURCE_ENERGY] : 0) || s.energy) === (s.energyCapacity || s.storeCapacity)) {
                    return false;
                }

                if (s.structureType === STRUCTURE_SPAWN) {
                    spawnStorage = s;
                    return true;
                } else if (!extensionStorage && s.structureType === STRUCTURE_EXTENSION) {
                    extensionStorage = s;
                    return false;
                } else if (!containerStorage && s.structureType === STRUCTURE_CONTAINER) {
                    containerStorage = s;
                    return false;
                } else if (!storageStorage && s.structureType === STRUCTURE_STORAGE) {
                    storageStorage = s;
                    return false;
                }
            },
        });

        let storage: StructureStorage | null = null;

        if (spawnStorage) {
            storage = spawnStorage;
        } else if (extensionStorage) {
            storage = extensionStorage;
        } else if (containerStorage) {
            storage = containerStorage;
        } else if (storageStorage) {
            storage = storageStorage;
        }

        if (storage && creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
    }

    creep.room.visual.line(creep.pos.x, creep.pos.y, miner.pos.x, miner.pos.y);
    return true;
}

export function spawn(): boolean {
    let availableMiner = findMinerWithoutRunner();

    if (!availableMiner) {
        return false;
    }

    SpawnUtil.main().createCreep([
        CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE,  MOVE,  MOVE,  MOVE,  MOVE,
    ], undefined, {
        belongsTo: availableMiner.name,
        role: ROLE,
        status: STATUS_COLLECTING,
    });

    return true;
}

function findMinerWithoutRunner(): Creep|null {
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.memory.role === Miner.ROLE) {
            if (!hasRunner(creep)) {
                return creep;
            }
        }
    }

    return null;
}

function hasRunner(creep: Creep): boolean {
    for (let creepName in Game.creeps) {
        if (creep.name === Game.creeps[creepName].memory.belongsTo) {
            return true;
        }
    }

    return false;
}
