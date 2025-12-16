/**
 * Checks whether a value is any function.
 *
 * @example
 * isFunction(class Trail {})  // true
 * isFunction(async () => {})  // true
 * isFunction(function () {})  // true
 */
export const isFunction = (fn: unknown): fn is (...args: any[]) => any => typeof fn === "function";
