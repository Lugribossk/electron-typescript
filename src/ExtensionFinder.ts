import fs from "fs";

type Process = {
    env: any;
    platform: string;
}

export default class ExtensionFinder {
    private _name: string;
    private _path: string;

    constructor(name: string, {platform, env}: Process) {
        this._name = name;
        switch (platform) {
            case "win32":
                this.windows(env);
                break;
            default:
                throw new Error("Platform not supported");
        }
    }

    private windows(env: any) {
        let extensionsFolder = env.LOCALAPPDATA + "/Google/Chrome/User Data/Default/Extensions/";
        let extensions = fs.readdirSync(extensionsFolder);
        extensions.forEach(extension => {
            let versions = fs.readdirSync(extensionsFolder + extension);
            if (versions.length === 0) {
                return;
            }
            let latestVersion = extensionsFolder + extension + "/" + versions[0];
            let manifest = JSON.parse(fs.readFileSync(latestVersion + "/manifest.json", "utf8"));
            if (manifest.name === this._name) {
                this._path = latestVersion;
            }
        });
    }

    get path() {
        return this._path;
    }

    static REACT = "React Developer Tools";

    static addIifNotExists(name: string, electron: Electron.ElectronMainAndRenderer, process: Process) {
        let extensions = (electron.BrowserWindow as any).getDevToolsExtensions();
        if (extensions[name]) {
            console.info("Dev tools extension", name, "already lodaded.");
            return;
        }

        let extension = new ExtensionFinder(name, process);
        if (extension.path) {
            console.info("Loading dev tools extension", name, "from", extension.path);
            electron.BrowserWindow.addDevToolsExtension(extension.path);
        }
    }
}