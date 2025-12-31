"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator } from "./helpers/destroy-iterator.js";

/**
 * Creates an entries iterator for any array-like, traversing from the first index to the last one.
 *
 * @param object - The array-like value.
 *
 * @returns The created iterator.
 *
 * @since 3.0.0-beta.0
 */
export function ArrayIterator<V = unknown>(
    object: ArrayLike<V>
): EntriesIterator<typeof ArrayIterator, typeof object, number, V> {
    object.length;
    let index = -1;
    type entry = [number, V, number];

    let iter: EntriesIterator<typeof ArrayIterator, typeof object, number, V> = {
        factory: ArrayIterator,
        get size() {
            return object ? object.length : undefined;
        },
        get object() {
            return object;
        },
        next: () => {
            if (!iter) return { done: true, value: null };

            const done = ++index >= object.length;

            if (done) return { done, value: null };

            return { done, value: [index, object[index], index] as entry };
        },
        peek: (diff = +1) => {
            const target = index + diff;
            let done = true;

            if (!iter || (done = target >= object.length)) {
                return { done, value: null };
            }

            if (target < 0) return { done: false, value: null };

            return {
                done,
                value: [target, object[target], target] as entry
            };
        },
        reset: () => {
            if (!iter) return false;

            index = -1;
            return true;
        },
        destroy: () => {
            if (!iter) return false;

            delete (symbolIterator as any).next;
            destroyIterator(iter);
            object = reset = iter = symbolIterator = null as any;

            return true;
        },
        [Symbol.iterator]: () => {
            if (!iter)
                return {
                    next: () => ({ done: true, value: null })
                };

            reset();
            return symbolIterator;
        }
    };

    let { reset } = iter;
    let symbolIterator = { next: iter.next };

    return iter;
}
