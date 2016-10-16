import {dialog, app, BrowserWindow, Menu} from "electron";
import * as _ from "lodash";
import WidevineFinder from "./WidevineFinder";
import ExtensionFinder from "./ExtensionFinder";

let isDevelopment = process.env.NODE_ENV !== "production";

let widevine = new WidevineFinder(process);
if (!widevine.path) {
    dialog.showErrorBox("", "Widevine CDM plugin not found. Is Chrome installed?");
}
app.commandLine.appendSwitch("widevine-cdm-path", widevine.path);
app.commandLine.appendSwitch("widevine-cdm-version", widevine.version);

app.on("ready", () => {
    // Remove all extensions that were added in previous runs in case they are outdated or not needed.
    _.forEach(BrowserWindow.getDevToolsExtensions(), extension => BrowserWindow.removeDevToolsExtension(extension.name));

    if (isDevelopment) {
        app.on("browser-window-created", (err, win) => {
            (win as any).toggleDevTools();
        });

        let react = new ExtensionFinder(ExtensionFinder.REACT, process);
        if (react.path) {
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

    window.setMenu(new Menu());
    window.loadURL("https://www.netflix.com");
});