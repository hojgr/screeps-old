export function manageMemory() {
    for (let idx in Memory.creeps) {
        if (!(idx in Game.creeps)) {
            delete Memory.creeps[idx];
        }
    }
}
