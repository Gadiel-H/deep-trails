/// @ts-check
const test = require("node:test");
const assert = require("node:assert");

test("The library loads without errors", () => {
    assert.doesNotThrow(() => {
        // Testing the getters
        const { VERSION, deepIterate, iterate, utils } = require("deep-trails");
        const {
            typeOf,
            toSimpleString,
            toPathString,
            toFunctionString,
            ...checkers
        } = require("deep-trails/utils");
        const {
            ArrayIterator,
            PropertiesIterator,
            MethodIterator,
            deepIterate: deepIterate1
        } = require("deep-trails/iterate");
    }, Error);
});
