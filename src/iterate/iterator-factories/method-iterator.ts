"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator } from "./helpers/destroy-iterator.js";
import { typeOf } from "../../utils/public/index.js";

/**
 * Creates an iterator that uses a method of an object for iterates over its entries.
 * The method must return an iterable iterator with entries in [key, value] format.
 *
 * @param object - The target object.
 * @returns The created iterator.
 */
export function MethodIterator<T extends object, K = unknown, V = unknown>(
    object: T & { size?: number },
    methodKey: string | symbol = "entries"
): EntriesIterator<typeof MethodIterator, typeof object, K, V> {
    let entriesMethod = object[methodKey] as Function,
        entries = entriesMethod.call(object) as IterableIterator<any>,
        type = typeOf(object),
        index = -1;

    type entry = [K, V, number];

    let iter: EntriesIterator<typeof MethodIterator, T, K, V> = {
        factory: MethodIterator,
        object,
        get size() {
            return type == "Map" || type == "Set" ? object.size : undefined;
        },
        next: () => {
            index++;

            const state = entries.next();

            if (!iter || !state || state.done) {
                return { done: true, value: null };
            }

            const entry = state.value as [K, V];
            const done = state.done;

            if (done || entry == null) {
                return { done: true, value: null };
            }

            const current = [entry[0], entry[1], index];

            return { done: false, value: current as entry };
        },
        peek: (diff = +1) => {
            if (!iter) return { done: true, value: null };

            const size = iter.size;
            const done = size != null && index + diff >= size;

            return { done, value: undefined };
        },
        reset: () => {
            if (!iter) return false;

            entries = entriesMethod.call(object);
            index = -1;

            return true;
        },
        destroy: () => {
            if (!iter) return false;

            entries = null as any;
            delete (symbolIterator as any).next;
            destroyIterator(iter);
            entriesMethod = null as any;
            object = reset = iter = symbolIterator = null as any;

            return true;
        },
        [Symbol.iterator]: () => {
            if (reset) reset();
            return symbolIterator;
        }
    };

    let { reset } = iter;
    let symbolIterator = { next: iter.next };

    return iter;
}
