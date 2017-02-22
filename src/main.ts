import { run as harvesterRun } from "./creeps/harvester";
import { manageCreeps } from "./creep_manager";

export function loop() {
    manageCreeps();

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];

        harvesterRun(creep);
    }
}
