"use strict";

const toString = Object.prototype.toString;
const objCache: WeakMap<object, string> = new WeakMap();

/** Default value for the second parameter of `typeOf`. */
typeOf.useCache = true;

/**
 * Detects the exact type of a value very quickly.
 *
 * If it is an object, `Object.prototype.toString` is used.
 *
 * @param value - Some value.
 * @param useCache - If it's truthy and `value` is an object, returns the previous cache result.
 *
 * @returns The string tag if `value` is an object; otherwise, `"null"` or `typeof value`.
 *
 * @example
 * typeOf(null)          // "null"
 * typeOf(Map)           // "Function"
 * typeOf({})            // "Object"
 * typeOf([])            // "Array"
 * typeOf(Number())      // "number"
 * typeOf(new Number())  // "Number"
 *
 * @since 3.0.0-beta.0
 */
export function typeOf(value: unknown, useCache = typeOf.useCache): string {
    if (value === null) return "null";

    const type = typeof value;

    if (type != "object" && type != "function") return type;

    // Get the cached type for objects
    if (useCache) {
        const saved = objCache.get(value as object);

        if (saved != null) return saved;
    }

    // Extract the string tag
    const objString = toString.call(value);
    const last = objString.length - 1;

    let chars = "",
        i = 7;

    while (++i < last) chars += objString[i];

    objCache.set(value as object, chars);

    return chars;
}
