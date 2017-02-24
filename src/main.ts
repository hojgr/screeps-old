import * as Harvester from "./creeps/phase1/harvester";
import * as HarvesterUpgrader from "./creeps/phase1/harvest_upgrader";
import * as HarvesterBuilder from "./creeps/phase1/harvest_builder";
import * as Miner from "./creeps/phase2/miner";
import * as Runner from "./creeps/phase2/runner";
import * as Upgrader from "./creeps/phase2/upgrader";
import { manageCreeps } from "./creep_manager";
import { manageMemory } from "./memory_manager";

export function loop() {
    manageMemory();
    manageCreeps();

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];

        let creepRunners = [
            Harvester.run,
            HarvesterBuilder.run,
            HarvesterUpgrader.run,
            Miner.run,
            Runner.run,
            Upgrader.run,
        ];

        for (let runner of creepRunners) {
            if (runner(creep)) {
                break;
            }
        }
    }
}
