"use strict";

import { toSimpleString } from "./for-anything.js";

/** RegExp for check identifiers compatible with dot notation. */
const dotNotation = /^[a-zA-Z_$][\w$]*$/;

/** Default options for `toPathString`. */
const defaults = (toPathString.options = {
    useBrackets: false
} as {
    /** If truthy, indicates to use bracket notation; otherwise, dot notation. */
    useBrackets?: boolean;
    /** Optional extra key to append to the path string. */
    extraKey?: unknown;
});

/**
 * Converts a path to a string.
 *
 * Uses `toSimpleString` for stringify keys.
 * Uses dot or bracket notation according to `options.useBrackets`.
 *
 * @param path - Path as array or string.
 * @param options - Options for more precision.
 * @returns String representation of the path.
 * @throws TypeError if some argument is invalid.
 *
 * @example
 * const path = [ "a", "b", "c", 0 ];
 * toPathString(path, { useBrackets: false })  // "a.b.c[0]"
 * toPathString(path, { useBrackets: true })   // '["a"]["b"]["c"][0]'
 * toPathString(path, { extraKey: "d" })       // "a.b.c[0].d"
 */
export function toPathString<T = unknown>(
    path: Readonly<T[]> | string,
    options: typeof toPathString.options = toPathString.options
): string {
    if (options == null) options = defaults;
    else if (typeof options !== "object") {
        throw new TypeError(
            "Expected an options object as second argument. " +
                `Received: ${toSimpleString(options)}\n`
        );
    }

    let { useBrackets, extraKey } = options;
    /** Symbol for detect if the extra key was not provided. */
    const notKnown = Symbol();

    if (!("useBrackets" in options)) useBrackets = defaults.useBrackets;
    extraKey =
        "extraKey" in options
            ? options.extraKey
            : "extraKey" in defaults
              ? defaults.extraKey
              : notKnown;

    if (typeof path === "string") {
        if (extraKey === notKnown) return path;

        if (useBrackets || typeof extraKey !== "string" || !dotNotation.test(extraKey)) {
            return `${path}[${toSimpleString(extraKey)}]`;
        }

        if (path.length === 0) return extraKey;

        return `${path}.${extraKey}`;
    }

    if (!Array.isArray(path)) {
        throw new TypeError(
            `Expected an array or a string as first argument. Received: ${toSimpleString(path)}.\n`
        );
    }

    if (path.length === 0 && extraKey === notKnown) return "";

    if (useBrackets) {
        const pathString = path.map((key) => `[${toSimpleString(key)}]`);

        if (extraKey !== notKnown) {
            pathString.push(`[${toSimpleString(extraKey)}]`);
        }

        return pathString.join("");
    } else {
        const pathString = path.map((key, index) => {
            if (typeof key === "string" && dotNotation.test(key)) {
                return index > 0 ? `.${key}` : key;
            }

            return `[${toSimpleString(key)}]`;
        });

        if (extraKey !== notKnown) {
            let extra: string = "";

            if (typeof extraKey !== "string" || !dotNotation.test(extraKey)) {
                extra = `[${toSimpleString(extraKey)}]`;
            } else {
                extra = pathString.length > 0 ? `.${extraKey}` : extraKey;
            }

            pathString.push(extra);
        }

        return pathString.join("");
    }
}

Object.defineProperty(toPathString, "options", {
    writable: false,
    configurable: false,
    enumerable: true,
    value: defaults
});
