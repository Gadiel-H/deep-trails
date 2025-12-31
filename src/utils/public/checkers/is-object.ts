/**
 * Checks whether a value is an object of any type.
 *
 * @example
 * isObject([ 0, 1 ])  // true
 * isObject(() => {})  // true
 * isObject(/^abc$/i)  // true
 * isObject(null)      // false
 *
 * @since 3.0.0-beta.1
 */
export const isObject = (value: unknown): value is object => {
    if (value == null) return false;

    const type = typeof value;
    return type === "object" || type === "function";
};
