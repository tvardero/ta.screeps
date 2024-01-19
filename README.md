# ta.Screeps

My gameplay code for the game named [Screeps](https://screeps.com/).

Totally for my own fun and enjoyment. Contributions will be ignored.

## Build and deploy

Please use VS Code.

* Use task `build` (`CTRL+SHIFT+B` keybind) to compile code from `./src/**/[name].ts` to `./dist/[name].js`.
* Use task `deploy` (open command palette > `Run Task`) to deploy code to the Screeps server.

Before deployment you need to create file `credentials.json` in project's folder. Put here a json with your `token` from Screeps site:

```json
{
  "token": "<your-token>"
}
```

**In case if you need to build manually**: run `tsc`, then copy contents of `dist/` folder to the game.

## Game loop

1. For each spawn:
   1. Get room of the spawn.
   2. Get worker creeps of the room:
      * If creep has a task - continue that task.
      * If creep is free - assign new task from prepared tasks.
   3. Prepare new tasks once in 10 ticks (to restore some CPU).

## Room projects

**Workflow:**

1. If has project - check "shouldFinish" condition. If finished - clear project.
2. If still has project - check interruption condition of project's RCL level. If interrupted - abandon project.
   2.1. If still has project - check interruption condition of project's RCL level -1, -2, -3 and so on. If interrupted - abandon project.
3. If still has project - continue with that project and exit.
   3.1. Else - Select highest priority project in RCL 0 (highest is 1, lowest is 5).
   3.2 Select highest priority project in RCL 1, if it has move priority than previous (RCL1-pri1 has move priority than RCL0-pri2) - swap.
   3.3. Continue until RCL 8 (incl.).
4. If project is still empty - noop for ~100 cycles (check for interruptions).
   4.1 ELSE - continue with new project.
5. Exit.

**Projects:**

* RCL 0
  * \# Has enemy defense structures
  * \# Has enemy creeps
  * \# Controller reserve nearing it's end
  * 1 Defeat enemy defense structures in room
  * 1 Defeat enemy creeps in room
  * 2 Unclaim enemy controller
  * 2 Claim free controller and build spawn
  * 2 Reserve free controller (if spawn can not be built)
* RCL 1
  * \# Has energy on ground
  * \# Controller is nearing its downgrade (< 10%)
  * 1 Collect energy on ground
  * 1 Supply for spawn
  * 1 Upkeep controller from downgrade (to 20%)
  * 2 Build roads from spawn to sources
  * 2 Build road from controller to spawn
  * 3 Build roads from controller to sources
  * 3 Build roads to exits
  * 3 Build one container near spawn
  * 3 Build one container near each source (up to 4 sources)
  * 3 Controller upgrade to RCL 2 for 200 cycles
  * 4 Fix containers deterioration
  * 4 Fix roads deterioration
* RCL 2
  * 1 Build spawn extensions
  * 1 Change supply logic: from container with full energy amount for every creep's CARRY part -> to nearest [spawn|extension|tower], otherwise mine energy
  * 2 Spawn stronger workers and recycle old ones
  * 2 Spawn guards
  * 2 Build walls and ramparts on exits
  * 3 Fix walls and ramparts deterioration
  * 3 Controller upgrade to RCL 3 for 200 cycles
  * 4 Fix extensions deterioration
* RCL 3
  * 1 Build tower
  * 2 Controller upgrade to RCL 4 for 200 cycles
  * 3 Fix tower deterioration
* RCL 4
  * TODO
* RCL 5
  * TODO
* RCL 6
  * TODO
* RCL 7
  * TODO
* RCL 8
  * TODO

## Creep logic

**Workflow:**

1. If has activity - continue with it.
   1.1. If activity is empty - get instructions from room project.

**Activities:**

* Move to
* Collect from
* Deposit to [ extensions | spawn | tower ]
* Upgrade controller
* Build
* Mine from
* Attack
* Heal
* Renew himself
* Fix

