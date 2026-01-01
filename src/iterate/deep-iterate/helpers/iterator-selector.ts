"use strict";

import type { EntriesIterator } from "../../../types/index";
import { isArrayLike, typeOf } from "../../../utils/public/index.js";
import { PropertiesIterator, ArrayIterator, MethodIterator } from "../../index.js";

const { hasOwnProperty } = Object.prototype,
    hasEntries = (obj: any): boolean =>
        typeof obj.entries === "function" && !hasOwnProperty.call(obj, "entries");

/**
 * Returns an entries iterator for an object of an accepted type, or null otherwise.
 * @internal
 */
export function makeIterator<T extends object>(
    object: T
): EntriesIterator<any, T, any, any> | null {
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

    if (isArrayLike(object)) {
        return ArrayIterator(object) as any;
    }

    if (hasEntries(object)) {
        return MethodIterator(object, "entries");
    }

    return PropertiesIterator(object);
}
