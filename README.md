# ta.Screeps

My gameplay code for the game named [Screeps](https://screeps.com/).

Totally for my own fun and enjoyment. Contributions will be ignored.

## Build and deploy

Please use VS Code.

* Use task `build` (`CTRL+SHIFT+B` keybind) to compile code from `./src/**/[name].ts` to `./dist/[name].js`.
* Use task `deploy` (open command palette > `Run Task`) to deploy code to Screeps server.

Before deployment you need to create file `credentials.json` in project's folder. Put here a json with your `token` from Screeps site:

```json
{
  "token": "<your-token>"
}
```
