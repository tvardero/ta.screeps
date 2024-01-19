import fs from "node:fs/promises";
import path from "node:path";

type Credentials = {
    token: string,
}

async function getCredentials(signal?: AbortSignal): Promise<Credentials> {
    const buf = await fs.readFile(path.resolve(__dirname, "credentials.json"), { signal });
    return JSON.parse(buf.toString("utf-8")) as Credentials;
}

async function getModules(signal?: AbortSignal): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    const dirPath = path.resolve(__dirname, "dist/")
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
        if (!file.isFile()) continue;

        const content = await fs.readFile(path.join(file.path, file.name), {signal, encoding: "utf-8"});
        result[path.basename(file.name, path.extname(file.name))] = content;
    }

    return result;
}

async function main(signal?: AbortSignal) {
    const body = JSON.stringify({
        branch: "default",
        modules: await getModules(signal)
    });

    const headers = {
        "X-Token": (await getCredentials()).token,
        'Content-Type': 'application/json; charset=utf-8'
    };

    signal?.throwIfAborted();

    console.log("deploying...")
    const response = await fetch("https://screeps.com/api/user/code", {
        body,
        headers,
        method: "post",
        signal
    });

    console.log("deploy status: " + response.statusText);
    if (response.status !== 200 && response.status !== 204) throw new Error(response.statusText);
}

const abortCtrl = new AbortController();
process.on('SIGINT', () => abortCtrl.abort());
const signal = abortCtrl.signal;

main(signal);