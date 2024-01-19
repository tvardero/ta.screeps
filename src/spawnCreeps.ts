export function spawnTinyWorker(spawn: StructureSpawn, offRoad: boolean): ScreepsReturnCode {
    const workParts: BodyPartConstant[] = [WORK, CARRY];
    const name = "tiny_worker:" + new Date().toString();
    return spawnWithLegs(spawn, offRoad, name, ...workParts);
}

export function canRenew(creep: Creep): boolean {
    // creep is still spawning
    if (!creep.ticksToLive) return false;

    // creep has CLAIM parts
    if (creep.body.some(b => b.type === CLAIM)) return false;

    // creep has > 10% of life left
    if (10 * creep.ticksToLive > CREEP_LIFE_TIME) return false;

    return true;
}

function spawnWithLegs(spawn: StructureSpawn, offRoad: boolean, name: string, ...workParts: BodyPartConstant[]): ScreepsReturnCode {
    const workCost = getCost(...workParts);

    const maxMovePartsByCost = (spawn.room.energyCapacityAvailable - workCost) / BODYPART_COST[MOVE];
    const movePartsAmount = Math.min(maxMovePartsByCost, calculateMovePartsAmount(offRoad, ...workParts));
    if (movePartsAmount < 1) return ERR_NOT_ENOUGH_EXTENSIONS;
    const moveParts = [...new Array(movePartsAmount)].map(() => MOVE);

    const parts = [...workParts, ...moveParts];
    const cost = getCost(...parts);

    if (spawn.room.energyAvailable < cost) return ERR_NOT_ENOUGH_ENERGY;
    return spawn.spawnCreep(parts, name);
}

function getCost(...parts: BodyPartConstant[]): number {
    return parts.reduce<number>((prev, cur) => prev + BODYPART_COST[cur], 0);
}

function calculateMovePartsAmount(offRoad: boolean, ...parts: BodyPartConstant[]) {
    const nonMoveParts = parts.filter(p => p !== MOVE);
    const fatiguePerMove = (offRoad ? 2 : 1) * nonMoveParts.length;
    return Math.ceil(fatiguePerMove / 2);
}