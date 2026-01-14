/// @ts-check
const test = require("node:test");
const assert = require("node:assert");
const { randomValues } = require("./__resources/index.js");

const {
    typeOf,
    toSimpleString,
    toPathString,
    toFunctionString,
    ...checkers
} = require("deep-trails/utils");

test("typeOf does not throw any errors", () => {
    assert.doesNotThrow(
        /// @ts-ignore
        () => randomValues.forEach((value) => typeOf(value, value)),
        Error
    );
});

test("toSimpleString does not throw any errors", () => {
    assert.doesNotThrow(() => randomValues.forEach(toSimpleString), Error);
});

test("The type checkers does not throw any errors", () => {
    for (const key in checkers) {
        if (!key.startsWith("is")) continue;

        /// @ts-ignore
        const checker = checkers[key];

        assert.doesNotThrow(() => randomValues.forEach(checker), Error);
    }
});
