"use strict";

import { toSimpleString } from "./for-anything.js";

/** RegExp for check identifiers compatible with dot notation. */
const dotNotation = /^[a-zA-Z_$][\w$]*$/;
const strKeyWithBrackets = (key: unknown) => `[${toSimpleString(key)}]`;
const strKeyWithDots = (key: unknown, index: number) => {
    if (typeof key === "string" && dotNotation.test(key)) {
        return index > 0 ? `.${key}` : key;
    }

    return `[${toSimpleString(key)}]`;
};

/**
 * Default options argument for `toPathString`.
 * @since 3.0.0-beta.0
 */
toPathString.options = {
    useBrackets: false
} as {
    /** If truthy, indicates to use bracket notation; otherwise, dot notation. */
    useBrackets?: boolean;
    /** Optional extra key to append to the path string. */
    extraKey?: unknown;
};

/**
 * Converts a path into a readable string with dot or bracket notation.
 *
 * @remarks
 * - Uses `toSimpleString` for stringify keys.
 * - If the path is a string, it is returned as is or the extra key is added.
 *
 * @param path - Path as array or string.
 * @param options - Options for more precision.
 *
 * @returns String representation of the path.
 *
 * @throws TypeError if some argument is invalid.
 *
 * @example
 * const path = [ "a", "b", "c", 0 ];
 * toPathString(path, { useBrackets: false })  // "a.b.c[0]"
 * toPathString(path, { useBrackets: true })   // '["a"]["b"]["c"][0]'
 * toPathString(path, { extraKey: "d" })       // "a.b.c[0].d"
 * toPathString("a.b", { useBrackets: true })  // "a.b"
 *
 * @since 3.0.0-beta.0
 */
export function toPathString<T = unknown>(
    path: Readonly<T[]> | string,
    options = toPathString.options
): string {
    const defaults = toPathString.options;

    if (options == null) options = defaults;
    else if (typeof options !== "object") {
        throw new TypeError(
            "Expected an options object as second argument. " +
                `Received: ${toSimpleString(options)}\n`
        );
    }

    let { useBrackets, extraKey } = options;
    /** Symbol for detect if the extra key was not provided. */
    const notProvided = Symbol();

    if (!("useBrackets" in options)) useBrackets = defaults.useBrackets;
    extraKey =
        "extraKey" in options
            ? options.extraKey
            : "extraKey" in defaults
              ? defaults.extraKey
              : notProvided;

    if (typeof path === "string") {
        if (extraKey === notProvided) return path;

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

    if (path.length === 0 && extraKey === notProvided) return "";

    if (useBrackets) {
        const pathString = path.map(strKeyWithBrackets);

        if (extraKey !== notProvided) {
            pathString.push(`[${toSimpleString(extraKey)}]`);
        }

        return pathString.join("");
    } else {
        const pathString = path.map(strKeyWithDots);

        if (extraKey !== notProvided) {
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
    value: toPathString.options
});
