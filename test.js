/// @ts-check
"use strict";

const test = require("node:test");
const assert = require("node:assert");

const testValues = [
    true,
    false,
    897,
    987n,
    null,
    NaN,
    "string",
    Symbol(),
    undefined,
    new Date(),
    /regexp/i,
    new Function(),
    async () => {},
    { ...console },
    [3, 6, 5]
];

test("The library loads without errors.", () => {
    assert.doesNotThrow(() => {
        const { deepIterate, VERSION } = require("deep-trails");
        const {
            checkers,
            typeOf,
            toSimpleString,
            toPathString,
            toFunctionString
        } = require("deep-trails/utils");
        const {
            ArrayIterator,
            PropertiesIterator,
            MethodIterator
        } = require("deep-trails/iterate");
    }, Error);
});

test("Certain functions do not fail with any parameter.", () => {
    const { typeOf, checkers, toSimpleString } = require("deep-trails").utils;

    assert.doesNotThrow(() => {
        for (const value of testValues) {
            /// @ts-ignore
            typeOf(value, value);
            /// @ts-ignore
            toSimpleString(value, value);
            /// @ts-ignore
            for (const key in checkers) checkers[key](value);
        }
    }, Error);
});

test("deepIterate throws type errors when it receives invalid parameters.", () => {
    const { deepIterate } = require("deep-trails");

    assert.throws(() => {
        /// @ts-ignore
        deepIterate("expects an object");
    }, TypeError);

    assert.throws(() => {
        /// @ts-ignore
        deepIterate({}, "() => {}");
    }, TypeError);

    assert.throws(() => {
        deepIterate({}, () => {}, {
            /// @ts-ignore
            maxParentVisits: NaN,
            /// @ts-ignore
            visitLogType: "none"
        });
    }, TypeError);
});
