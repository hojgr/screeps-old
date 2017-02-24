import * as SpawnUtil from "./spawn_util";

export function getSourceCount() {
    return getSources().length;
}

export function getSources(): Source[] {
    return SpawnUtil.main().room.find<Source>(FIND_SOURCES);
}

export function getUnassignedSource(): Source | null {
    return SpawnUtil.main().pos.findClosestByRange<Source>(FIND_SOURCES, {
        filter: (s: Source) => {
            let isAvailable = true;

            for (let creepName in Game.creeps) {
                let creepMemory = Game.creeps[creepName].memory;

                if ("source" in creepMemory && creepMemory.source === s.id) {
                    isAvailable = false;
                }
            }

            return isAvailable;
        },
    });
}

export function findClosestEnergyStorage(creep: Creep) : StructureSpawn | StructureExtension | StructureContainer | StructureStorage | null {
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

    if (spawnStorage) {
        return spawnStorage;
    } else if (extensionStorage) {
        return extensionStorage;
    } else if (containerStorage) {
        return containerStorage;
    } else if (storageStorage) {
        return storageStorage;
    }

    return null;
}

export function getNotFullStorage(creep: Creep): StructureStorage | StructureContainer | null {
    let container = creep.pos.findClosestByRange<StructureContainer>(FIND_STRUCTURES, {
                                                                    // to prevent walking to almost empty container
        filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < (s.storeCapacity - 100),
    });

    if (container) {
        return container;
    }

    let storage = creep.pos.findClosestByRange<StructureStorage>(FIND_MY_STRUCTURES, {
                                                                    // to prevent walking to almost empty container
        filter: (s: StructureStorage) => s.structureType === STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < (s.storeCapacity - 100),
    });

    if (storage) {
        return storage;
    }

    return null;
}


export function getStorage(creep: Creep): StructureStorage | StructureContainer | null {
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
