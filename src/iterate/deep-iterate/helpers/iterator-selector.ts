"use strict";

import { isArrayLike, typeOf } from "../../../utils/public/index.js";
import { PropertiesIterator } from "../../index.js";

const arrayEntries = Array.prototype.entries;
const { hasOwnProperty } = Object.prototype,
    hasEntries = (obj: any): obj is { entries: Function } =>
        typeof obj.entries === "function" && !hasOwnProperty.call(obj, "entries");

/**
 * Returns an entries iterator for an object of an accepted type, or null otherwise.
 * @internal
 */
export function makeIterator<T extends object>(
    object: T
): (Iterator<any, any, any> & { size: number | undefined }) | null {
    if (typeof object === "function") return null;

    const type = typeOf(object);

    if (
        type === "WeakSet" ||
        type === "WeakMap" ||
        type === "Date" ||
        type === "RegExp" ||
        type === "Promise" ||
        object instanceof Error
    ) {
        return null;
    }

    let iterator: any;

    if (isArrayLike(object)) {
        iterator = arrayEntries.call(object);
        iterator.size = object.length;
    } else if (hasEntries(object)) {
        iterator = object.entries();
        iterator.size = undefined;

        if (object instanceof Map || object instanceof Set) {
            iterator.size = (object as any).size;
        }
    } else {
        return PropertiesIterator(object);
    }

    return iterator;
}
