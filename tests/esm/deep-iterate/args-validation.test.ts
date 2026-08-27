import test from "node:test";
import assert from "node:assert";

import { deepIterate } from "deep-trails";

test("deepIterate throws type errors when it receives invalid arguments", () => {
    assert.throws(() => deepIterate("expects an object" as any), TypeError);

    assert.throws(() => deepIterate({}, "() => {}" as any), TypeError);

    const invalidOptions = {
        onCircular: "continue",
        visitLogType: "none"
    };

    assert.throws(() => deepIterate({}, () => {}, invalidOptions as any), TypeError);
});
