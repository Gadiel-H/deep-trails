"use strict";

import { typeOf, toFunctionString, isObject } from "../index.js";
import { objectCases as cases } from "./helpers/object-cases.js";

/** Cache for primitive data. */
const cache: Map<unknown, string> = new Map();
const toString = Object.prototype.toString;

/**
 * Creates a simple, readable string for any value, similar to `console.log`.
 *
 * @remarks Uses caching, and is faster with primitives and functions.
 *
 * @param value - Value to stringify.
 * @returns String representation of the value.
 *
 * @example
 * toSimpleString(Set)       // "[NativeFunction: Set]"
 * toSimpleString([ 2, 4 ])  // "Array(2) [ ... ]"
 * toSimpleString(/abc/i)    // "/abc/i"
 * toSimpleString("abc")     // '"abc"'
 *
 * @since 3.0.0-beta.0
 */
export function toSimpleString(value: unknown): string {
    if (!(0 in arguments)) return "";

    let string = cache.get(value);
    if (string != null) return string;

    const type = typeof value;

    if (!isObject(value)) {
        if (type === "string") string = `"${value}"`;
        else if (type === "bigint") string = `${value}n`;
        else string = String(value);

        cache.set(value, string);
        return string;
    }

    if (type === "function") {
        return toFunctionString(value as Function);
    }

    const objType = typeOf(value);

    return objType in cases ? cases[objType](value) : toString.call(value);
}
