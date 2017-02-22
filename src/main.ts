import * as Harvester from "./creeps/phase1/harvester";
import * as HarvesterUpgrader from "./creeps/phase1/harvest_upgrader";
import * as HarvesterBuilder from "./creeps/phase1/harvest_builder";
import { manageCreeps } from "./creep_manager";
import { manageMemory } from "./memory_manager";

export function loop() {
    manageMemory();
    manageCreeps();

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];

        Harvester.run(creep);
        HarvesterUpgrader.run(creep);
        HarvesterBuilder.run(creep);
    }
}
