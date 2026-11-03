"use strict";

const toString = Object.prototype.toString;
const objCache: WeakMap<object, string> = new WeakMap();

/**
 * Default value for the second parameter of `typeOf`.
 * Initially it is `false`.
 *
 * @remarks Changed initial value from `true` to `false` in 3.0.0.
 *
 * @since 3.0.0-beta.0
 * @compatibleSince 3.0.0
 */
typeOf.useCache = false;

/**
 * Detects the exact type of a value.
 *
 * @remarks
 * - Uses `Object.prototype.toString` for objects.
 * - Always updates the cache, except when it is requested and a string tag is available.
 *
 * @param value - Some value.
 * @param useCache - If it is truthy and `value` is an object, returns the cached result (if any).
 * By default is {@linkcode typeOf.useCache}.
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
 * @since 1.0.0
 * @compatibleSince 3.0.0
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
