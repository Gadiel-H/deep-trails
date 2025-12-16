/**
 * Checks whether a value is an object, excluding functions.
 *
 * @example
 * isNoFnObject(Object)  // false
 * isNoFnObject(null)    // false
 * isNoFnObject([])      // true
 */
export const isNoFnObject = <T>(obj: T): obj is Exclude<T, Function> & object =>
    obj != null && typeof obj === "object";
