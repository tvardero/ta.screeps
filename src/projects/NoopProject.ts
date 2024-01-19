class NoopProject extends Project {
  public constructor(room: Room) {
    super(room);
  }

  public get RclLevel(): number {
    throw new Error("Method not implemented.");
  }

  public get Priority(): number {
    throw new Error("Method not implemented.");
  }

  public checkFinished(): boolean {
    throw new Error("Method not implemented.");
  }

  public toMemory(): string {
    throw new Error("Method not implemented.");
  }

  public instruct(creep: AnyCreep): void {
    throw new Error("Method not implemented.");
  }
}