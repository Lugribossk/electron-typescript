import * as electron from "electron";
import * as _ from "lodash";
import WidevineFinder from "./WidevineFinder";

let widevine = new WidevineFinder(process);
electron.app.commandLine.appendSwitch("widevine-cdm-path", widevine.path);
electron.app.commandLine.appendSwitch("widevine-cdm-version", widevine.version);

electron.app.on("ready", () => {
    let window = new electron.BrowserWindow({
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false,
            partition: "persist:session",
            plugins: true
        }
    });

    window.on("closed", () => {
        window = null;
    });

    window.setMenu(null);
    window.loadURL("https://netflix.com");

    _.forEach([], () => {});
});