"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator, getSymbolIterator } from "./helpers/index.js";

/**
 * Creates an entries iterator for any array-like, traversing from the first index to the last one.
 *
 * @param object - The array-like value.
 *
 * @returns The created iterator.
 *
 * @example
 * const array = ["a", "b", "c"];
 * const iterator = ArrayIterator(array);
 * const state = iterator.next();
 *
 * console.log(state); // { done: false, value: [0, "a", 0] }
 *
 * @since 3.0.0-beta.0
 *
 * @deprecated
 * It will be removed in version 3.0.0
 *
 * This factory was exposed during beta and will not
 * be part of the stable API because it is redundant.
 *
 * Instead, use native iterators like `Array.prototype.entries.call(object)`
 * and indexes for the peek functionality.
 */
export function ArrayIterator<V = unknown>(
    object: ArrayLike<V>
): EntriesIterator<typeof ArrayIterator, typeof object, number, V> {
    object.length;
    let index = -1;

    type Entry = [number, V, number];

    let iter: EntriesIterator<typeof ArrayIterator, typeof object, number, V> | null = {
        factory: ArrayIterator,
        object,
        get size() {
            return object.length;
        },
        next: () => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const nextIndex = index + 1;
            const size = object.length;
            const done = nextIndex >= size;

            if (nextIndex === size) index++;

            if (done) {
                return { done: true, value: null };
            }

            index++;
            const value = object[index];
            const entry = [index, value, index] as Entry;

            return { done: false, value: entry };
        },
        peek: (diff = +1) => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const target = index + diff;

            if (target < 0) {
                return { done: false, value: null };
            }

            const done = target >= object.length;

            if (done) {
                return { done: true, value: null };
            }

            const value = object[target];
            const entry = [target, value, target] as Entry;

            return { done: false, value: entry };
        },
        reset: () => {
            if (iter == null) return false;

            index = -1;
            return true;
        },
        destroy: () => {
            if (iter == null) return false;

            destroyIterator(iter);

            object = iter = null as any;
            reset = next = null as any;

            return true;
        },
        [Symbol.iterator]: () => {
            if (iter == null) {
                return getSymbolIterator();
            }

            reset();
            return { next };
        }
    };

    let { reset, next } = iter;

    return iter;
}
