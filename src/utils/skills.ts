export function cost(skills: string[]) {
    return _.reduce(skills, function(sum, skill) {
        return sum + BODYPART_COST[skill];
    }, 0);
}
