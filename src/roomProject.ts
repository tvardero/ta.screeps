enum Interruption {
    NoInterruption = 0,
    GracefulInterruption = 1,
    ImmediateInterruption = 2,
};

const cachedProjects: Record<string, Project | undefined> = {};
const interruptionCheckTicks: Record<string, number | undefined> = {};

export function getProject(room: Room): Project {
    const cached = cachedProjects[room.name];
    if (cached && isProjectAlive(room, cached)) return cached;

    let project: Project | null = null;

    const roomMemory = Memory.rooms[room.name] as MyRoomMemory;
    if (roomMemory.projectName) {
        project = Project.fromMemory(room, roomMemory.projectName, roomMemory.projectArgs);
        if (!isProjectAlive(room, project)) project = null;
    }

    project = getNewProject(room);

    cachedProjects[room.name] = project;
    return project;
}

function isProjectAlive(room: Room, project: Project): boolean {
    if (project.checkFinished()) return false;

    // check if already checked for interruption in this tick
    const interruptionCheckTick = interruptionCheckTicks[room.name];
    if (interruptionCheckTick === Game.time) return true;

    const interruption = checkInterruption(room);
    switch (interruption) {
        case Interruption.ImmediateInterruption: {
            project.cancel(false);
            return false;
        }
        case Interruption.GracefulInterruption: {
            if (!project.CancellationRequested) project.cancel(true);
        }
    }

    interruptionCheckTicks[room.name] = Game.time;
    return true;
}

function getNewProject(room: Room): Project {
    let project_a: Project | null = null;
    let project_b: Project | null = null;

    project_a = getRcl0Project(room);
    if (project_a?.Priority === 1) return project_a;

    project_b = getRcl1Project(room);
    if (project_b?.Priority === 1) return project_b;
    project_a = compareProjects(project_a, project_b);

    project_b = getRcl2Project(room);
    if (project_b?.Priority === 1) return project_b;
    project_a = compareProjects(project_a, project_b);

    project_b = getRcl3Project(room);
    if (project_b?.Priority === 1) return project_b;
    project_a = compareProjects(project_a, project_b);

    return project_a ?? new NoopProject(room);
}

function checkInterruption(room: Room): Interruption {
    const value = Math.max(
        checkRcl0Interruptions(room),
        checkRcl1Interruptions(room),
        checkRcl2Interruptions(room),
        checkRcl3Interruptions(room));
    return value as Interruption;
}

function checkRcl0Interruptions(room: Room): Interruption {
    return Interruption.NoInterruption;
}

function checkRcl1Interruptions(room: Room): Interruption {
    return Interruption.NoInterruption;
}

function checkRcl2Interruptions(room: Room): Interruption {
    return Interruption.NoInterruption;
}

function checkRcl3Interruptions(room: Room): Interruption {
    return Interruption.NoInterruption;
}

function compareProjects(a: Project | null, b: Project | null): Project | null {
    if (!a) return b;
    if (!b) return a;
    return a.Priority > b.Priority ? b : a;
}

function getRcl0Project(room: Room): Project | null {
    return null;
}

function getRcl1Project(room: Room): Project | null {
    return null;
}

function getRcl2Project(room: Room): Project | null {
    return null;
}

function getRcl3Project(room: Room): Project | null {
    return null;
}