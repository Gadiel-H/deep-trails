"use strict";

import test from "node:test";
import assert from "node:assert";
import { inspect } from "node:util";

import { PropertiesIterator } from "deep-trails/iterate";
import {
    assertDuringIterationState,
    type PostIterationState,
    type PreIterationState
} from "./helpers.ts";

await test(`.peek()`, async () => {
    const object = globalThis;
    const iter = PropertiesIterator(object, () => ["Object", "Number", "inexistent"]);
    const lastIndex = iter.getSize()! - 1;

    await test("Returns correct states before the iteration", () => {
        const expected: PreIterationState = { done: false, value: null };

        assert.deepStrictEqual(
            iter.peek(0),
            expected,
            `Expected peek(0) to return ${inspect(expected)}`
        );

        assert.deepStrictEqual(
            iter.peek(-1),
            expected,
            `Expected peek(-1) to return ${inspect(expected)}`
        );

        const first = iter.peek("first");
        assertDuringIterationState(first);
        assert.strictEqual(first.value[2], 0);

        const next = iter.peek();
        assertDuringIterationState(next);
        assert.strictEqual(next.value[2], 0);

        const last = iter.peek("last");
        assertDuringIterationState(last);
        assert.strictEqual(last.value[2], lastIndex);
    });

    await test("Does not advance and returns relative states during iteration", () => {
        let state: ReturnType<typeof iter.next>;

        while (!(state = iter.next()).done) {
            assertDuringIterationState(state);

            assert.deepStrictEqual(iter.peek(0), state);

            const next = iter.peek();
            if (state.value[2] === lastIndex) {
                const expected: PostIterationState = { done: true, value: null };
                assert.deepStrictEqual(next, expected);
            } else {
                assertDuringIterationState(next);
                assert.strictEqual(next.value[2], state.value[2] + 1);
            }

            const previous = iter.peek(-1);
            if (state.value[2] === 0) {
                const expected: PreIterationState = { done: false, value: null };
                assert.deepStrictEqual(previous, expected);
            } else {
                assertDuringIterationState(previous);
                assert.strictEqual(previous.value[2], state.value[2] - 1);
            }
        }
    });

    await test("Returns correct states after the iteration", () => {
        const expected: PostIterationState = { done: true, value: null };

        assert.deepStrictEqual(iter.peek(), expected);
        assert.deepStrictEqual(iter.peek(0), expected);

        const last = iter.peek(-1);
        assertDuringIterationState(last);
        assert.strictEqual(last.value[2], lastIndex);
    });

    await test("Returns a final state after clear", () => {
        iter.clear();

        const expected: PostIterationState = { done: true, value: null };

        assert.deepStrictEqual(iter.peek(), expected);
        assert.deepStrictEqual(iter.peek(0), expected);
        assert.deepStrictEqual(iter.peek("first"), expected);
        assert.deepStrictEqual(iter.peek("last"), expected);
        assert.deepStrictEqual(iter.peek(-1), expected);
    });
});
