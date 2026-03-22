/// @ts-check
const test = require("node:test");
const assert = require("node:assert");
const { randomValues } = require("../__resources/index.js");

const { typeOf } = require("deep-trails/utils");

test("typeOf does not throw any errors", () => {
    assert.doesNotThrow(
        /// @ts-ignore
        () => randomValues.forEach((value) => typeOf(value, value)),
        Error
    );
});
