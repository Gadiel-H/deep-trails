import test from "node:test";
import assert from "node:assert";

import { VERSION } from "deep-trails";
const importCallOpts = { with: { type: "json" } };

test(`VERSION has the same string specified in package.json`, async () => {
    const { version } = (await import("../../package.json", importCallOpts)).default;

    assert.strictEqual(VERSION, version);
});
