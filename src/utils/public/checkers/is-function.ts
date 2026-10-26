/**
 * Checks whether a value is any function.
 *
 * @example
 * isFunction(class Trail {})  // true
 * isFunction(async () => {})  // true
 * isFunction(function () {})  // true
 *
 * @since 3.0.0
 */
export const isFunction = <T>(value: T) => typeof value === "function";
