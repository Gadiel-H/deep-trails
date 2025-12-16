/**
 * Checks whether a value is an object of any type.
 *
 * @example
 * isObject([ 0, 1 ])  // true
 * isObject(() => {})  // true
 * isObject(/^abc$/i)  // true
 * isObject(null)      // false
 */
export const isObject = (obj: unknown): obj is object => {
    if (obj == null) return false;

    const type = typeof obj;
    return type === "object" || type === "function";
};
