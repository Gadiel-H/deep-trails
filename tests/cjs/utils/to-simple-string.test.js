/// @ts-check
const test = require("node:test");
const assert = require("node:assert");
const { randomValues } = require("../__resources/index.js");

const { toSimpleString } = require("deep-trails/utils");

test("toSimpleString does not throw any errors", () => {
    assert.doesNotThrow(() => randomValues.forEach(toSimpleString), Error);
});
