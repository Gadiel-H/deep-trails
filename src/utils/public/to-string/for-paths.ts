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
 * @since 3.0.0-beta.3
 */
toPathString.options = {
    useBrackets: false
} as {
    /**
     * If truthy, indicates to use bracket notation; otherwise, mixed notation.
     *
     * @deprecated Since 3.0.0-beta.3
     *
     * Deprecated because strings are better than booleans for multiple values ​​of an option.
     * Use {@linkcode toPathString.notation} or pass the option "notation" instead.
     *
     * This option will be removed in v3.0.0
     */
    useBrackets?: boolean;
};

/** @inline */
type Notation = "mixed" | "bracket";

/** @inline */
type OptionsArgument = typeof toPathString.options & {
    /** The notation in which the path and/or the extra key string will be created. */
    notation?: Notation;
    /** Optional extra key to append to the path string. */
    extraKey?: unknown;
};

/**
 * The notation in which the path and/or the extra key string will be created.
 * @since 3.0.0-beta.3
 */
toPathString.notation = "mixed" as Notation;

/**
 * Converts a path into a readable string with bracket or mixed notation.
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
 * toPathString(path, { notation: "mixed" })     // "a.b.c[0]"
 * toPathString(path, { notation: "bracket" })   // '["a"]["b"]["c"][0]'
 * toPathString(path, { extraKey: "d" })         // "a.b.c[0].d"
 * toPathString("a.b", { notation: "bracket" })  // "a.b"
 *
 * @since 3.0.0-beta.3
 */
export function toPathString<T = unknown>(
    path: Readonly<T[]> | string,
    options: OptionsArgument = {
        notation: toPathString.notation,
        useBrackets: toPathString.options.useBrackets
    } as OptionsArgument
): string {
    const defaults = toPathString.options;

    if (options == null) {
        options = {
            notation: toPathString.notation,
            useBrackets: defaults.useBrackets
        } as OptionsArgument;
    } else if (typeof options !== "object") {
        throw new TypeError(
            "Expected an options object as second argument. " +
                `Received: ${toSimpleString(options)}\n`
        );
    }

    const useBracketsGiven = "useBrackets" in options;
    const notationGiven = "notation" in options;
    let useBrackets = false;

    if ((notationGiven && useBracketsGiven) || notationGiven) {
        useBrackets = options.notation === "bracket";
    } else {
        useBrackets = options.useBrackets as boolean;
    }

    /** Symbol for detect if the extra key was not provided. */
    const notProvided = Symbol();

    const extraKey = "extraKey" in options ? options.extraKey : notProvided;

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
