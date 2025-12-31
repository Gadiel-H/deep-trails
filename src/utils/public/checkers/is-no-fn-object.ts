/**
 * Checks whether a value is an object, excluding functions.
 *
 * @example
 * isNoFnObject(Object)  // false
 * isNoFnObject(null)    // false
 * isNoFnObject([])      // true
 *
 * @since 3.0.0-beta.1
 */
export const isNoFnObject = <T>(value: T): value is Exclude<T, Function> & object =>
    value != null && typeof value === "object";
