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
 */
export const isPlainObject = <T>(obj: T): obj is Record<PropertyKey, any> => {
    if (obj == null || typeof obj !== "object") return false;

    const proto = getPrototypeOf(obj);
    return proto === null || proto === objPrototype;
};
