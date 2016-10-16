import "source-map-support/register";
import mocha from "mocha";
import expect from "unexpected";
import unexpectedSinon from "unexpected-sinon";
import sinon from "sinon";

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
