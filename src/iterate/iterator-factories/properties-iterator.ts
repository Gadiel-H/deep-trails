"use strict";

import type { EntriesIterator } from "../../types/index";
import { destroyIterator, getSymbolIterator } from "./helpers/index.js";
import { recordSchema, validators, validateObject } from "../../__schemas/index.js";
import { isObject, toSimpleString } from "../../utils/public/index.js";

const { isArray } = Array;
const { anyFunction } = validators;
const emptyObject = {};
const argumentsSchema = recordSchema({
    object: { __type: "object", __test: isObject },
    keysGetter: anyFunction()
});

/**
 * Creates an iterator for the properties of an object using a function to get its keys.
 *
 * @param object - The target object.
 * @param keysGetter - Function to get the object's keys. By default is `Reflect.ownKeys`.
 *
 * @returns The created iterator.
 *
 * @example // For...of loop
 * const iterator = PropertiesIterator({ a: 1, b: 2, c: 3 });
 * 
 * for (const [ key, value ] of iterator) console.log(key, value);
 *
 * @example // Peek object entries
 * const iterator = PropertiesIterator({ a: 1, b: 2, c: 3 });
 * const print = console.log;
 *
 * print(iterator.peek("first").value);  // [ "a", 1, 0 ]
 * print(iterator.peek("last").value);   // [ "c", 3, 2 ]
 * print(iterator.next().value);         // [ "a", 1, 0 ]
 * print(iterator.peek(0).value);        // [ "a", 1, 0 ]
 * 
 * @example // Destroy the iterator
 * const iterator = PropertiesIterator({ a: 1, b: 2, c: 3 });
 * const entries = [ ...iterator ];
 * 
 * iterator.destroy();
 * console.log(iterator);  // {} (empty object)
 *
 * @since 3.0.0
 */
export function PropertiesIterator<T extends object, K extends keyof T = keyof T, V = T[K]>(
    object: T,
    keysGetter: (object: T) => K[] = Reflect.ownKeys as any
): EntriesIterator<typeof PropertiesIterator, T, K, V> {
    validateObject(
        { object, keysGetter },
        argumentsSchema,
        emptyObject,
        "arguments in PropertiesIterator"
    );

    let keys = keysGetter(object),
        index = -1;

    if (!isArray(keys)) {
        throw new TypeError(
            `keysGetter must return an array of keys. Returned: ${toSimpleString(keys)}\n`
        );
    }

    type Entry = [K, V, number];

    // `iter == null` checks whether the iterator has been destroyed
    // Helps to avoid type errors when using its methods after destruction
    let iter: EntriesIterator<typeof PropertiesIterator, T, K, V> | null = {
        factory: PropertiesIterator,
        object,
        get size() {
            return keys?.length;
        },
        next: () => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const nextIndex = index + 1;
            const size = keys.length;

            if (nextIndex === size) index++;

            if (nextIndex >= size) {
                return { done: true, value: null };
            }

            index++;
            const key = keys[index];
            const value = object[key];
            const entry = [key, value, index] as Entry;

            return { done: false, value: entry };
        },
        peek: (position = +1) => {
            if (iter == null) {
                return { done: true, value: null };
            }

            const size = keys.length;
            let target: number;

            // Selects the target index based on the position
            if (position === "first") {
                target = 0;
            } else if (position === "last") {
                target = size <= 0 ? 0 : size - 1;
            } else {
                target = index + Number(position);
            }

            if (target >= size) {
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

            // Removes object references
            keys = keysGetter = null as any;
            object = iter = null as any;
            next = null as any;

            return true;
        },
        [Symbol.iterator]: () => {
            if (iter == null) {
                return getSymbolIterator();
            }

            return { next };
        }
    };

    // Required by `[Symbol.iterator]()`
    let { next } = iter;

    return iter;
}
