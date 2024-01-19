const spawns = Game.spawns;

for(const spawn of Object.values(spawns))
{
    const creeps = spawn.room.find(FIND_MY_CREEPS);
    if (spawn.room.energyAvailable > 200 && creeps.length < 5) {
        const creepName = "worker" + new Date().toString();
        spawn.spawnCreep([WORK, CARRY, MOVE], creepName)
    }
}