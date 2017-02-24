import * as Harvester from "./creeps/phase1/harvester";
import * as HarvestUpgrader from "./creeps/phase1/harvest_upgrader";
import * as HarvestBuilder from "./creeps/phase1/harvest_builder";
import * as Miner from "./creeps/phase2/miner";
import * as Runner from "./creeps/phase2/runner";
import * as Upgrader from "./creeps/phase2/upgrader";

export function manageCreeps(): void {
    let creepModules = [
        {max: 0, spawnFn: Harvester.spawn},
        {max: 0, spawnFn: HarvestUpgrader.spawn},
        {max: 0, spawnFn: HarvestBuilder.spawn},
        {max: -1, spawnFn: Runner.spawn},
        {max: -1, spawnFn: Miner.spawn},
        {max: 10, spawnFn: Upgrader.spawn},
    ];

    for (let idx in creepModules) {
        if (creepModules[idx].spawnFn(creepModules[idx].max)) {
            break;
        }
    }
}
