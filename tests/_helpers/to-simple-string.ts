"use strict";

const { toString } = Object.prototype;

/**
 * Returns a simple string representation for any value.
 *
 * @example
 * str(Set)         // "[Function: Set]"
 * str([ 0, 1 ])    // "[object Array]"
 * str("Hello\n")   // '"Hello\n"'
 */
export function str(value: unknown): string {
    if (!(0 in arguments)) return "";

    if (value === null) return "null";

    const type = typeof value;

    if (type === "bigint") return `${value}n`;
    if (type === "string") return JSON.stringify(value);
    if (type === "object") return toString.call(value);
    if (type === "function") {
        return `[Function: ${(value as Function).name}]`;
    }

    return String(value);
}
