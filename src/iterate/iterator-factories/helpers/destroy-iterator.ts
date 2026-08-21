"use strict";

import type { PropertiesIterable } from "../../../types/index";

const keys: (keyof PropertiesIterable<any, any>)[] = [
    "getSize",
    "object",
    "next",
    "destroy",
    "peek",
    "reset",
    Symbol.iterator
];
const len = keys.length;

/**
 * Deletes the known properties and internal references of an `PropertiesIterable`.
 * - This helps the closure to be garbage-collected.
 * - By doing this, the iterator and its parts are no longer guaranteed to work.
 * @internal
 */
export const destroyIterator = (object: PropertiesIterable<any, any>) => {
    let i = -1;
    while (++i < len) delete object[keys[i]];
};
