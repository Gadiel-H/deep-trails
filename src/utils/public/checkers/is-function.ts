/**
 * Checks whether a value is any function.
 *
 * You can force the TS predicate with a type argument.
 *
 * @example
 * isFunction(class Trail {})  // true
 * isFunction(async () => {})  // true
 * isFunction(function () {})  // true
 *
 * @since 3.0.0-beta.1
 */
export const isFunction = <T extends (...args: any[]) => any>(value: unknown): value is T =>
    typeof value === "function";
