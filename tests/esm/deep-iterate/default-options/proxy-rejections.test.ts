"use strict";

import test from "node:test";
import assert from "node:assert";
import { str } from "../../../_helpers/index.ts";

import type { Options } from "deep-trails/types/deep-iterate";
import { deepIterate } from "deep-trails";

const { options } = deepIterate;
const optionKeys = Object.freeze(Reflect.ownKeys(deepIterate.options));
type OptionsKey = keyof Options<object>;
const invalidOptions: Readonly<Record<OptionsKey, unknown>> = {
    iterateKeys: "no",
    iterateValues: 1,
    pathType: String,
    onCircular: "iterate",
    visitLogType: null,
    exposeVisitLog: 1,
    onGetter: "ignore"
};

await test("Rejects setting invalid values", () => {
    for (const __key in invalidOptions) {
        const key = __key as OptionsKey;

        const expectedInvalidMsg = `Verify that ${str(invalidOptions[key])} is invalid for the ${str(key)} option`;

        assert.throws(
            () => ((options as any)[key] = invalidOptions[key]),
            TypeError,
            expectedInvalidMsg
        );

        try {
            (options as any)[key] = invalidOptions[key];
        } catch (error) {
            const errorStack = String((error as Error).stack);
            assert.ok(
                errorStack.includes(key),
                `Expected the error message to include ${str(key)}`
            );
        }
    }
});

await test("Rejects defining getters and setters", () => {
    for (const key of optionKeys) {
        assert.throws(() => {
            Object.defineProperty(options, key, { get() {}, set() {} });
        }, TypeError);
    }
});

await test("Rejects deleting properties", () => {
    for (const key of optionKeys) {
        assert.throws(() => {
            delete deepIterate.options[key as OptionsKey];
        }, TypeError);
    }
});

await test("Rejects changing the prototype", () => {
    assert.throws(() => {
        Object.setPrototypeOf(deepIterate.options, null);
    });
});
