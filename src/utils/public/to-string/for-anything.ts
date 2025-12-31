"use strict";

import { typeOf, toFunctionString } from "../index.js";
import { objectCases } from "./helpers/object-cases.js";

/** Cache for primitive data. */
const cache: Map<unknown, string> = new Map();
const toString = Object.prototype.toString;

/**
 * Creates a simple, readable string for any value, similar to `console.log`.
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

    const type = typeof value;

    if (!value || (type !== "object" && type !== "function")) {
        let string = cache.get(value);
        if (string != null) return string;

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
    const cases = objectCases;

    return objType in cases ? cases[objType](value) : toString.call(value);
}
