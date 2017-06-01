import {dialog, app, BrowserWindow} from "electron";
import * as _ from "lodash";
import {findReact} from "./ExtensionFinder";
import {findFlash, findWidevine} from "./PluginFinder";

let isDevelopment = process.env.NODE_ENV !== "production";

let widevine = findWidevine(process);
if (!widevine.exists()) {
    dialog.showErrorBox("", "Widevine CDM plugin not found. Is Chrome installed?");
}
widevine.addToCommandLine(app);

let flash = findFlash(process);
if (!flash.exists()) {
    dialog.showErrorBox("", "Flash plugin not found. Is Chrome installed?");
}
flash.addToCommandLine(app);

app.on("ready", () => {
    // Remove all extensions that were added in previous runs in case they are outdated or not needed.
    _.forEach(BrowserWindow.getDevToolsExtensions(), extension => BrowserWindow.removeDevToolsExtension(extension.name));

    if (isDevelopment) {
        app.on("browser-window-created", (err, win) => {
            win.webContents.toggleDevTools();
        });

        let react = findReact(process);
        if (react.exists()) {
            console.info("Loading React dev tools from", react.path);
            BrowserWindow.addDevToolsExtension(react.path);
        }
    }

    let window: Electron.BrowserWindow | null = new BrowserWindow({
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false,
            partition: "persist:session",
            plugins: true,
            allowDisplayingInsecureContent: true,
            allowRunningInsecureContent: true
        }
    });

    window.on("closed", () => {
        window = null;
    });

    (window as any).setMenu(null);
    window.loadURL("https://www.netflix.com");
});