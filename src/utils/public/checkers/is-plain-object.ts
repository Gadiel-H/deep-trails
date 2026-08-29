const { getPrototypeOf, prototype: objPrototype } = Object;

/**
 * Checks whether a value is a non-function object
 * and its prototype is `null` or `Object.prototype`.
 *
 * @example
 * isPlainObject({ key: "value" })     // true
 * isPlainObject(JSON.parse("{}"))     // true
 * isPlainObject(Object.create(null))  // true
 * isPlainObject(new Object())         // true
 *
 * @since 3.0.0
 */
export const isPlainObject = <T>(
    value: T
): value is Exclude<T, Function> & object & Record<PropertyKey, unknown> => {
    if (value == null || typeof value !== "object") return false;

    const proto = getPrototypeOf(value);
    return proto === null || proto === objPrototype;
};
