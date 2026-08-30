"use strict";

import type { PropertiesIterable } from "../../types/index";
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
 * Creates an stateful iterator for the properties of an object using a function to get its keys.
 *
 * See {@linkcode PropertiesIterable} to known the interface.
 *
 * @remarks
 * - Depends on a closure to store the iteration state, not on `this`.
 * - Multiple `[Symbol.iterator]()` iterators will interfere with each other.
 *
 * @param object - The target object.
 * @param keysGetter - Function to get the object's keys. By default is `Reflect.ownKeys`.
 *
 * @example
 * const iterator = PropertiesIterator({ a: 1, b: 2, c: 3 });
 *
 * for (const [ key, value ] of iterator) console.log(key, value);
 *
 * iterator.reset();  // Recommended for another iteration.
 *
 * @since 3.0.0
 */
export function PropertiesIterator<
    T extends object,
    K extends PropertyKey = keyof T,
    V = T[K & keyof T]
>(object: T, keysGetter: (object: T) => K[] = Reflect.ownKeys as any): PropertiesIterable<T, K, V> {
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
    type ObjKey = K & keyof T;

    // `iter == null` checks whether the iterator has been destroyed
    // Helps to avoid type errors when using its methods after destruction
    let iter: PropertiesIterable<T, K, V> | null = {
        object,
        getSize: () => {
            if (keys == null) return undefined;
            return Number(keys.length);
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
            const value = object[key as ObjKey];
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
            const value = object[key as ObjKey];
            const entry = [key, value, target] as Entry;

            return { done: false, value: entry };
        },
        reset: () => {
            if (iter == null) return false;

            keys = keysGetter(object);
            index = -1;

            return true;
        },
        clear: () => {
            if (iter == null) return false;

            // Removes object references
            keys = keysGetter = null as any;
            object = iter = null as any;

            return true;
        },
        [Symbol.iterator]: () => ({ next })
    };

    // Required by `[Symbol.iterator]()`
    let { next } = iter;

    return iter;
}
