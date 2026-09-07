"use strict";

import test from "node:test";
import assert from "node:assert";
import { inspect } from "node:util";

import { PropertiesIterator } from "deep-trails/iterate";

await test(".getSize()", async () => {
    const returnTypeMsg = "an integer >= 0";
    const iter = PropertiesIterator(console);

    await test(`Returns ${returnTypeMsg} before clear`, () => {
        const size = iter.getSize();

        assert.ok(
            Number.isInteger(size) && size! >= 0,
            `Expected the size to be ${returnTypeMsg}. Received ${inspect(size)}`
        );
    });

    await test("Returns undefined after clear", () => {
        iter.clear();
        const size = iter.getSize();

        assert.strictEqual(
            size,
            undefined,
            `Expected the size to be undefined. Received ${inspect(size)}`
        );
    });
});
