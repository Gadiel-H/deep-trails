"use strict";

import assert from "node:assert";
import { inspect } from "node:util";

import type { PropertiesIterable } from "deep-trails";

/** State returned by `.next()` */
export type NextState = ReturnType<PropertiesIterable<object, PropertyKey, unknown>["next"]>;

/** State returned by `.peek()` */
export type PeekState = ReturnType<PropertiesIterable<object, PropertyKey, unknown>["peek"]>;

/** State returned by `.next()` or `.peek()` */
export type AnyState = NextState | PeekState;

/** State during the iteration */
export type IterationState = NextState & { done: false; value: [PropertyKey, unknown, number] };

/** State before starting the iteration */
export type PreIterationState = PeekState & { done: false; value: null };

/** State after finishing the iteration */
export type PostIterationState = NextState & { done: true; value: null };

/**
 * Validates that a state has a valid entry and "done" is false.
 */
export function assertDuringIterationState(state: AnyState): asserts state is IterationState {
    const { value: entry, done } = state;

    assert.strictEqual(done, false, `Expected "done" to be false. Received ${inspect(done)}`);

    const has012Indices = !!entry && 0 in entry && 1 in entry && 2 in entry;

    assert.ok(
        Array.isArray(entry) && has012Indices && entry.length === 3,
        `Expected the entry to be an array with exactly 3 items. Received ${inspect(entry)}`
    );

    const index: number = entry[2];

    assert.ok(
        Number.isInteger(index) && index >= 0,
        `Expected the index to be an integer >= 0. Received ${inspect(index)}`
    );
}
