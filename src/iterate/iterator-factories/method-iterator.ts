"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator, getSymbolIterator } from "./helpers/index.js";

type EntriesMethod = (...args: any[]) => IterableIterator<any>;

/**
 * Creates an iterator that uses a method of an object for iterate over its entries.
 *
 * The method must return an iterable iterator with entries in `[key, value]` format.
 *
 * @param object - The target object.
 * @param methodKey - The key where is the method.
 *
 * @returns An wrapped entries iterator.
 *
 * @example
 * const object = new Map([[Date, "date"], [Set, "set"]]);
 * const iterator = MethodIterator(object);
 * const state = iterator.next();
 *
 * console.log(state); // { done: false, value: [Date, "date", 0] }
 *
 * @since 3.0.0-beta.0
 */
export function MethodIterator<T extends object, K = unknown, V = unknown>(
    object: T & { size?: number },
    methodKey: string | symbol = "entries"
): EntriesIterator<typeof MethodIterator, typeof object, K, V> {
    let entriesMethod = object[methodKey] as EntriesMethod,
        entries = entriesMethod.call(object),
        index = -1;

    type Entry = [K, V, number];

    let iter: EntriesIterator<typeof MethodIterator, T, K, V> | null = {
        factory: MethodIterator,
        object,
        get size() {
            if (object instanceof Set || object instanceof Map) {
                return object.size;
            }

            return undefined;
        },
        next: () => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const state = entries.next();
            const entry = state.value as [K, V];

            if (state.done || !entry) {
                return { done: true, value: null };
            }

            index++;
            const current = [entry[0], entry[1], index] as Entry;

            return { done: false, value: current };
        },
        peek: (diff = +1) => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const size = iter.size;
            const target = index + diff;
            const done = size != null && target >= size;

            if (done) {
                return { done: true, value: null };
            }

            return { done, value: undefined };
        },
        reset: () => {
            if (iter == null) return false;

            entries = entriesMethod.call(object);
            index = -1;

            return true;
        },
        destroy: () => {
            if (iter == null) return false;

            destroyIterator(iter);

            entries = entriesMethod = null as any;
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
