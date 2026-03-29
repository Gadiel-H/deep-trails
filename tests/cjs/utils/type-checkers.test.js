/// @ts-check
const test = require("node:test");
const assert = require("node:assert");
const { randomValues } = require("../__resources/index.js");

const {
    typeOf,
    toSimpleString,
    toPathString,
    toFunctionString,
    ...checkers
} = require("deep-trails/utils");

test("The type checkers does not throw any errors", () => {
    for (const key in checkers) {
        /// @ts-ignore
        const checker = checkers[key];

        assert.doesNotThrow(() => randomValues.forEach(checker), Error);
    }
});
