"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator } from "./helpers/destroy-iterator.js";

/**
 * Creates an iterator for the properties of an object using a function to get its keys.
 *
 * @param object - The target object.
 * @param keysGetter - Function to get the object's keys. By default is `Reflect.ownKeys`.
 *
 * @returns The created iterator.
 *
 * @since 3.0.0-beta.0
 */
export function PropertiesIterator<T extends object, K extends keyof T = keyof T, V = T[K]>(
    object: T,
    keysGetter: (object: T) => K[] = Reflect.ownKeys as any
): EntriesIterator<typeof PropertiesIterator, T, K, V> {
    let keys = keysGetter(object);
    let index = -1;

    type entry = [K, V, number];

    let it: EntriesIterator<typeof PropertiesIterator, T, K, V> = {
        factory: PropertiesIterator,
        object,
        get size() {
            if (!keys) return undefined;
            else return keys.length;
        },
        next: () => {
            let done = false;

            if (!it || (done = ++index >= keys.length)) {
                return { done: true, value: null };
            }

            const key = keys[index];

            return { done, value: [key, object[key], index] as entry };
        },
        peek: (diff = +1) => {
            const target = index + diff;
            let done = false;

            if (!it || (done = target >= keys.length)) {
                return { done: true, value: null };
            }

            if (target < 0) return { done, value: null };

            const key = keys[target];
            return { done, value: [key, object[key], target] as entry };
        },
        reset: () => {
            if (!it) return false;

            keys = keysGetter(object);
            index = -1;

            return true;
        },
        destroy: () => {
            if (!it) return false;

            object = keys = null as any;
            delete (symbolIterator as any).next;
            destroyIterator(it);
            reset = it = symbolIterator = null as any;

            return true;
        },
        [Symbol.iterator]: () => {
            if (reset) reset();
            return symbolIterator;
        }
    };

    let { reset } = it;
    let symbolIterator = { next: it.next };

    return it as any;
}
