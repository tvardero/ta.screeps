abstract class Project {
  protected room: Room;
  protected cancellationRequested: boolean = false;
  protected done: boolean = false;

  protected constructor(room: Room) {
    this.room = room;
  }

  public static fromMemory(room: Room, projectName: string, projectArgs?: string): Project {
    switch (projectName) {
      case "NoopProject": return new NoopProject(room);
      case "CollectEnergyOnGroundProject": return new CollectEnergyOnGroundProject(room, projectArgs);
      default: throw new Error(`Unknown project type: ${projectName}`);
    }
  }

  public cancel(graceful: boolean) {
    this.cancellationRequested = true;
    this.done = this.done || !graceful;
  }

  public get CancellationRequested(): boolean { return this.cancellationRequested; }

  public abstract get RclLevel(): number;
  public abstract get Priority(): number;
  public abstract checkFinished(): boolean;
  public abstract toMemory(): string;
  public abstract instruct(creep: AnyCreep): void;
}