import "source-map-support/register";
import * as mocha from "mocha";
import * as expect from "unexpected";
import * as unexpectedSinon from "unexpected-sinon";
import * as sinon from "sinon";

type Wrapped = {
    restore: () => void
}

let setupDone = false;
let wrappeds: Wrapped[] = [];
let oldWrap = (sinon as any).wrapMethod;
(sinon as any).wrapMethod = (...args: any[]) => {
    let out: Wrapped = oldWrap.apply(sinon, args);
    wrappeds.push(out);

    if (!setupDone) {
        afterEach(() => {
            wrappeds.forEach(wrapped => {
                wrapped.restore();
            });
            wrappeds = [];
        });
        setupDone = true;
    }
    return out;
};

expect.installPlugin(unexpectedSinon);
