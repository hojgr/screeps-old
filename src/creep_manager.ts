import * as Harvester from "./creeps/phase1/harvester";
import * as HarvestUpgrader from "./creeps/phase1/harvest_upgrader";
import * as HarvestBuilder from "./creeps/phase1/harvest_builder";

export function manageCreeps(): void {
    let creepModules = [
        {max: 5, spawnFn: Harvester.spawn},
        {max: 2, spawnFn: HarvestUpgrader.spawn},
        {max: 1, spawnFn: HarvestBuilder.spawn},
    ];

    for (let idx in creepModules) {
        if (creepModules[idx].spawnFn(creepModules[idx].max)) {
            break;
        }
    }
}
