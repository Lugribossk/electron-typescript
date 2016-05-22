import * as electron from "electron";
import Blah from "./Blah";
import * as _ from "lodash";

electron.app.on("ready", () => {
    let window = new electron.BrowserWindow({
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false
        }
    });

    window.on("closed", () => {
        window = null;
    });

    _.forEach([], () => {});
});