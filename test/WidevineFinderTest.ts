import * as expect from "unexpected";
import * as sinon from "sinon";
import * as fs from "fs";
import WidevineFinder from "../src/WidevineFinder";

describe("WidevineFinder", () => {
    it("should find path and version on Windows.", () => {
        sinon.stub(fs, "readdirSync").returns(["1.4.8.885"]);

        let widevine = new WidevineFinder({
            env: {
                LOCALAPPDATA: "C:/Users/Test/AppData/Local"
            },
            platform: "win32"
        });

        expect(widevine.path, "to be",
            "C:/Users/Test/AppData/Local/Google/Chrome/User Data/WidevineCDM/1.4.8.885/_platform_specific/win_x64/widevinecdmadapter.dll");
        expect(widevine.version, "to be", "1.4.8.885");
    });
});