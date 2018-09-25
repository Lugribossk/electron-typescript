import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

type Process = {
    env: any;
    platform: string;
}

let subfolders = (folder: string) => _.filter(fs.readdirSync(folder), file => fs.statSync(path.join(folder, file)).isDirectory());

let highestVersion = (folder: string) => {
    let versions = _.filter(subfolders(folder), name => /^\d+\.\d+\.\d+\.\d+$/.test(name));
    let version = versions[versions.length - 1]; // TODO

    return {
        folder: path.join(folder, version),
        version: version
    };
};

export default class PluginFinder {
    private _commandLineName: string;
    readonly version: string;
    readonly path: string;

    constructor({env}: Process, name: string, commandLineName: string, filename: string = "", isApplication: boolean = false) {
        this._commandLineName = commandLineName;
        if (isApplication) {
            let {folder, version} = highestVersion(path.join(env["ProgramFiles(x86)"], "/Google/Chrome/Application"));
            this.version = version;
            this.path = path.join(folder, name, filename);
        } else {
            let {folder, version} = highestVersion(path.join(env.LOCALAPPDATA, "/Google/Chrome/User Data", name));
            this.version = version;
            this.path = path.join(folder, filename);
        }
        console.log(this.path);
    }

    exists() {
        try {
            fs.accessSync(this.path);
            return true;
        } catch (e) {
            return false;
        }
    }

    addToCommandLine(app: Electron.App) {
        app.commandLine.appendSwitch(this._commandLineName + "-path", this.path);
        app.commandLine.appendSwitch(this._commandLineName + "-version", this.version);
    }
}

export const findWidevine = (process: Process) => new PluginFinder(process, "WidevineCdm", "widevine-cdm", "_platform_specific/win_x64/widevinecdm.dll", true);

export const findFlash = (process: Process) => new PluginFinder(process, "PepperFlash", "ppapi-flash", "pepflashplayer.dll");
