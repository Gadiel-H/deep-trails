"use strict";

import test from "node:test";
import assert from "node:assert";

import { deepIterate } from "deep-trails";

const optionKeys = Object.freeze(Reflect.ownKeys(deepIterate.options));

test("Its prototype is null", () => {
    const proto = Object.getPrototypeOf(deepIterate.options);
    assert.strictEqual(proto, null);
});

test("Has only strings as keys", () => {
    const symbolKeys = optionKeys.filter((key) => typeof key === "symbol");
    const totalSymbols = symbolKeys.length;
    const hasOnlyStrings = totalSymbols === 0;

    assert.ok(hasOnlyStrings, `Expected 0 symbols as keys, but there are ${totalSymbols}.`);
});
