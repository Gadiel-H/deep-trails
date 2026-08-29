"use strict";

import test from "node:test";
import assert from "node:assert";

import { deepIterate } from "deep-trails";

const { options } = deepIterate;

test("Cannot delete it", () => {
    assert.throws(() => {
        delete (deepIterate as any).options;
    }, TypeError);
});

test("Cannot change its value", () => {
    const wantsTypeError = "Expected TypeError";

    assert.throws(
        () => (deepIterate.options = {} as any),
        TypeError,
        wantsTypeError + " with directly assignment"
    );

    assert.throws(
        () => {
            Object.defineProperty(deepIterate, "options", {
                configurable: true,
                writable: true
            });
            Object.defineProperty(deepIterate, "options", { value: {}, writable: true });
        },
        TypeError,
        wantsTypeError + " with defineProperty()"
    );

    assert.strictEqual(deepIterate.options, options);
});
