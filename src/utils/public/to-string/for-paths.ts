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

/** @inline */
type Notation = "mixed" | "bracket";

/** @inline */
type OptionsArgument = {
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
    options?: OptionsArgument
): string {
    if (options == null) {
        options = { notation: toPathString.notation };
    } else if (typeof options !== "object") {
        throw new TypeError(
            "Expected an options object as second argument. " +
                `Received: ${toSimpleString(options)}\n`
        );
    }

    const bracketsOnly =
        "notation" in options
            ? options.notation === "bracket"
            : toPathString.notation === "bracket";

    /** Symbol for detect if the extra key was not provided. */
    const notProvided = Symbol();

    const extraKey = "extraKey" in options ? options.extraKey : notProvided;

    if (typeof path === "string") {
        if (extraKey === notProvided) return path;

        if (bracketsOnly || typeof extraKey !== "string" || !dotNotation.test(extraKey)) {
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

    if (bracketsOnly) {
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
