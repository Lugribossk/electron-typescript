import * as electron from "electron";
import * as _ from "lodash";
import WidevineFinder from "./WidevineFinder";

let isProduction = process.env.NODE_ENV === "production";

let widevine = new WidevineFinder(process);
if (!widevine.path) {
    electron.dialog.showErrorBox("", "Widevine CDM plugin not found. Is Chrome installed?");
}
electron.app.commandLine.appendSwitch("widevine-cdm-path", widevine.path);
electron.app.commandLine.appendSwitch("widevine-cdm-version", widevine.version);

electron.app.on("ready", () => {
    //if (!isProduction) {
        electron.app.on("browser-window-created", (err, win) => {
            (win as any).toggleDevTools();
        });
        // let id = "fmkadmapgofadopljbjfkapdkoienihi/0.14.11_0";
        // electron.BrowserWindow.addDevToolsExtension(process.env.LOCALAPPDATA + "/Google/Chrome/User Data/Default/Extensions/" + id);
    //}

    let window = new electron.BrowserWindow({
        alwaysOnTop: true,
        webPreferences: {
            partition: "persist:session",
            plugins: true
        }
    });

    window.on("closed", () => {
        window = null;
    });

    window.setMenu(null);

    let url: string;
    if (isProduction) {
        url = "file://" + __dirname + "/renderer/index.html"; // TODO fix
    } else {
        url = "http://localhost:8080";
    }
    window.loadURL(url);

    _.forEach([], () => {});
});