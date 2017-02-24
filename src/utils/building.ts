export function findClosestBuildingWithPriority(creep: Creep) {
    let extensionStructure: ConstructionSite | null = null;
    let containerStructure: ConstructionSite | null = null;
    let closest: ConstructionSite | null = null;

    creep.pos.findClosestByRange<ConstructionSite>(FIND_CONSTRUCTION_SITES, {
        filter: (cs: ConstructionSite) => {
            if(!extensionStructure && cs.structureType === STRUCTURE_EXTENSION) {
                extensionStructure = cs;
            } else if(!containerStructure && cs.structureType === STRUCTURE_CONTAINER) {
                containerStructure = cs;
            } else if(!closest) {
                closest = cs;
            }

            return false;
        }
    });

    if(extensionStructure) {
        return extensionStructure;
    }

    if(containerStructure) {
        return containerStructure;
    }

    if(closest) {
        return closest;
    }

    return null;
}
