import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an async function, excluding async generator functions.
 *
 * Detection relies on the string created by `toFunctionString`.
 *
 * @requires {@linkcode toFunctionString}
 *
 * @example
 * isAsyncFunction(async () => {})         // true
 * isAsyncFunction(async function () {})   // true
 * isAsyncFunction({ async do() {} }.do)   // true
 * isAsyncFunction(async function* () {})  // false (it's generator)
 * isAsyncFunction(n => new Promise(n))    // false (missing keyword)
 * isAsyncFunction((async x => x).bind())  // false (detected as native)
 *
 * @since 3.0.0
 */
export const isAsyncFunction = <T>(
    value: T
): value is T & ((...args: unknown[]) => Promise<unknown>) => {
    if (typeof value !== "function") return false;

    const string = toFunctionString(value);

    return string.startsWith("[Async") && !string.startsWith("[AsyncGenerator");
};
