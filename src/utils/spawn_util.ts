import { MemoryRoles } from "../creep_manager";

export function main() {
    let spawnName = Object.keys(Game.spawns)[0];

    return Game.spawns[spawnName];
}

export function _c(roles: MemoryRoles, roleName: string) {
    if(!(roleName in roles))
        return 0;

    return roles[roleName];
}
