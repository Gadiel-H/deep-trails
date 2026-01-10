"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator, getSymbolIterator } from "./helpers/index.js";

/**
 * Creates an iterator for the properties of an object using a function to get its keys.
 *
 * @param object - The target object.
 * @param keysGetter - Function to get the object's keys. By default is `Reflect.ownKeys`.
 *
 * @returns The created iterator.
 *
 * @example
 * const object = { a: 1, b: 2, c: 3 };
 * const iterator = PropertiesIterator(object);
 *
 * for (const [ key, value ] of iterator) {
 *     console.log({ key, value });
 * }
 *
 * @since 3.0.0-beta.0
 */
export function PropertiesIterator<T extends object, K extends keyof T = keyof T, V = T[K]>(
    object: T,
    keysGetter: (object: T) => K[] = Reflect.ownKeys as any
): EntriesIterator<typeof PropertiesIterator, T, K, V> {
    let keys = keysGetter(object),
        index = -1;

    type Entry = [K, V, number];

    let iter: EntriesIterator<typeof PropertiesIterator, T, K, V> | null = {
        factory: PropertiesIterator,
        object,
        get size() {
            if (keys == null) return undefined;
            return keys.length;
        },
        next: () => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const done = index + 1 >= keys.length;

            if (done) {
                return { done: true, value: null };
            }

            index++;
            const key = keys[index];
            const value = object[key];
            const entry = [key, value, index] as Entry;

            return { done: false, value: entry };
        },
        peek: (diff = +1) => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const target = index + diff;
            const done = target >= keys.length;

            if (done) {
                return { done: true, value: null };
            }

            if (target < 0) {
                return { done: false, value: null };
            }

            const key = keys[target];
            const value = object[key];
            const entry = [key, value, target] as Entry;

            return { done: false, value: entry };
        },
        reset: () => {
            if (iter == null) return false;

            keys = keysGetter(object);
            index = -1;

            return true;
        },
        destroy: () => {
            if (iter == null) return false;

            destroyIterator(iter);

            keys = keysGetter = null as any;
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
