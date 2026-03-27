/// @ts-check
const test = require("node:test");
const assert = require("node:assert");
const { deepIterate } = require("deep-trails");
const { typeOf } = require("deep-trails/utils");

const root = console;
const callback = () => {};
const options = deepIterate.options; // defaults

test("deepIterate returns the expected result object", () => {
    const result = deepIterate(root, callback, options);

    assert.ok(
        result !== null && typeof result === "object",
        "The return value should be a non-function object"
    );

    assert.strictEqual(result.root, root, "result.root should match the input root");
    assert.strictEqual(
        result.callback,
        callback,
        "result.callback should match the input callback"
    );

    assert.ok(Object.isFrozen(result), "The result object should be frozen");
    assert.ok(Object.isFrozen(result.options), "result.options should be frozen");

    const missingOptions = Object.keys(options).filter(
        (key) => !Object.prototype.hasOwnProperty.call(result.options, key)
    );

    assert.strictEqual(
        missingOptions.length,
        0,
        `result.options is missing keys: ${missingOptions.map((k) => `"${k}"`).join(", ")}`
    );

    const actualType = typeOf(result.visitLog).toLowerCase();
    const expectedType = options.visitLogType;

    assert.strictEqual(
        actualType,
        expectedType,
        `result.visitLog type should be "${expectedType}", got "${actualType}"`
    );
});
