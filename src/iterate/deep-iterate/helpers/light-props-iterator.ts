"use strict";

import type { LightEntriesIterator } from "../../../types/deep-iterate";

/**
 * Creates an iterator for the properties of an object using `Reflect.ownKeys` to get its keys.
 * @internal
 */
export function LightPropsIterator<T extends object>(object: T): LightEntriesIterator {
    let keys = Reflect.ownKeys(object),
        index = -1;

    const size = keys.length;

    const next = () => {
        if (index + 1 >= size) {
            return { done: true, value: null } as const;
        }

        const key = keys[++index];
        const value = object[key];
        const entry = [key, value] as [typeof key, unknown];

        return { done: false, value: entry } as const;
    };

    return {
        source: "ownProperties",
        size,
        next,
        [Symbol.iterator]: () => ({ next })
    };
}
