import * as Harvester from "./creeps/phase1/harvester";
import * as HarvestUpgrader from "./creeps/phase1/harvest_upgrader";
import * as HarvestBuilder from "./creeps/phase1/harvest_builder";
import * as Miner from "./creeps/phase2/miner";
import * as Runner from "./creeps/phase2/runner";
import * as Cleaner from "./creeps/phase2/cleaner";
import * as Upgrader from "./creeps/phase2/upgrader";
import * as Builder from "./creeps/phase2/builder";
import * as Repairer from "./creeps/phase2/repairer";
import * as SpawnUtil from "./utils/spawn_util";

export interface MemoryRoles {
    [role: string]: number
};

interface Storages {
    containers: StructureContainer[],
    storages: StructureStorage[]
}

export interface GameState {
    spawnCapacity: number,
    memoryRoles: MemoryRoles,
    storages: Storages
}

export function manageCreeps(): void {
    let spawn = SpawnUtil.main();

    let roles = countRoles();
    let spawnCapacity = getSpawnerCapacity(spawn);
    let storages: Storages = {
        containers: getContainers(spawn.room),
        storages: getStorages(spawn.room),
    }

    let gameState: GameState = {
        spawnCapacity: spawnCapacity,
        memoryRoles: roles,
        storages: storages
    }

    let spawners = [
        Runner.spawn,
        Miner.spawn,
        Upgrader.spawn,
        Builder.spawn,

        Repairer.spawn,

        Harvester.spawn,
        HarvestUpgrader.spawn,
        HarvestBuilder.spawn,
        Cleaner.spawn,
    ];

    for(let spawner of spawners) {
        if(spawner(spawn, gameState)) {
            break;
        }
    }
}

function getContainers(room: Room): StructureContainer[] {
    return _.filter(room.find<StructureContainer>(FIND_STRUCTURES, {
        filter: (s: StructureContainer) => s.structureType === STRUCTURE_CONTAINER
    }));
}

function getStorages(room: Room): StructureStorage[] {
    return _.filter(room.find<StructureStorage>(FIND_STRUCTURES, {
        filter: (s: StructureStorage) => s.structureType === STRUCTURE_STORAGE
    }));
}

function getSpawnerCapacity(spawn: Spawn) {
    let spawnAndExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: (s: StructureSpawn | StructureExtension) => s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION
        },
    );

    return _.reduce(spawnAndExtensions, (acc: number, s: StructureSpawn | StructureExtension) => acc + s.energy);
}

function countRoles() {
    return _.reduce(Memory.creeps, (carry: MemoryRoles, c) => {
        if(!(c.role in carry)) {
            carry[c.role] = 1;
        } else {
            carry[c.role]++;
        }

        return carry;
    }, {});
}
