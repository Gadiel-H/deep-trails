/// @ts-check
const test = require("node:test");
const assert = require("node:assert");
const { randomValues } = require("../__resources/index.js");

const utils = require("deep-trails/utils");
const checkers = Object.fromEntries(
    Object.entries(utils).filter(
        ([key, value]) => key.startsWith("is") && typeof value === "function"
    )
);

test("The type checkers does not throw any errors", () => {
    for (const key in checkers) {
        /// @ts-ignore
        const checker = checkers[key];

        assert.doesNotThrow(() => randomValues.forEach(checker), Error);
    }
});
