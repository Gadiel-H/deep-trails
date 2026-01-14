/// @ts-check
const test = require("node:test");
const assert = require("node:assert");

test(`VERSION has the same string specified in package.json`, () => {
    const { version } = require("../../package.json");
    const { VERSION } = require("deep-trails");

    assert.strictEqual(VERSION, version);
});
