"use strict";

import test from "node:test";
import assert from "node:assert";
import { inspect } from "node:util";

import { PropertiesIterator } from "deep-trails/iterate";
import type { PropertiesIterable } from "deep-trails";

type State = ReturnType<PropertiesIterable<object, PropertyKey, unknown>["next"]>;
type FinalState = State & { done: true; value: null };

await test(".next()", async () => {
    const object = globalThis;
    const iter = PropertiesIterator(object, () => ["Object", "Number", "inexistent"]);
    let state: ReturnType<typeof iter.next>;

    await test("Returns correct states during the iteration", () => {
        while (!(state = iter.next()).done) {
            const { value: entry, done } = state;

            assert.strictEqual(
                done,
                false,
                `Expected "done" to be false. Received ${inspect(done)}`
            );

            const has012Indices = 0 in entry && 1 in entry && 2 in entry;

            assert.ok(
                Array.isArray(entry) && has012Indices && entry.length === 3,
                `Expected the entry to be an array with exactly 3 items. Received ${inspect(entry)}`
            );

            const key: PropertyKey = entry[0];
            const value: unknown = entry[1];
            const index: number = entry[2];

            assert.ok(
                Number.isInteger(index) && index >= 0,
                `Expected the index to be an integer >= 0. Received ${inspect(index)}`
            );

            if (!(key in object)) {
                assert.strictEqual(
                    value,
                    undefined,
                    `Expected the value to be undefined because the object does not have ${inspect(key)}. Received ${inspect(value)}`
                );
            }
        }
    });

    await test("Returns a correct final state", () => {
        const expected: FinalState = { done: true, value: null };

        assert.deepStrictEqual(
            state,
            expected,
            `Expected the final state to be ${inspect(expected)}. Received ${inspect(state)}`
        );
    });
});
