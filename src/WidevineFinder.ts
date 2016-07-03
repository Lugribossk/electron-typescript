import * as fs from "fs";

type Process = {
    env: any;
    platform: string;
}

/**
 * Find the WidevineCDM plugin.
 * See http://electron.atom.io/docs/tutorial/using-widevine-cdm-plugin/
 */
export default class WidevineFinder {
    private _version: string = null;
    private _path: string = null;
    
    constructor({platform, env}: Process) {
        switch (platform) {
            case "win32":
                this.windows(env);
                break;
            default:
                throw new Error("Platform not supported");
        }
    }

    private windows(env: any) {
        let versionsFolder = env.LOCALAPPDATA + "/Google/Chrome/User Data/WidevineCDM/";
        let versions = fs.readdirSync(versionsFolder);
        if (versions.length === 0) {
            return;
        }
        
        let version = versions[0];
        let path = versionsFolder + version + "/_platform_specific/win_x64/widevinecdmadapter.dll";

        if (!fs.existsSync(path)) {
            return;
        }

        this._version = version;
        this._path = path;
    }

    get path() {
        return this._path;
    }

    get version() {
        return this._version;
    }
}