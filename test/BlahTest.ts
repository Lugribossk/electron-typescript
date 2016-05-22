import * as expect from "unexpected";
import Blah from "../src/Blah";

describe("Blah", () => {
    it("should multiply by 2.", () => {
        expect(new Blah().blah(2), "to be", 4);
    });
});
