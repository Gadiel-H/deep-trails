import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an asynchronous function.
 *
 * Detection compares the constructor name and Object.prototype.toString tag,
 * falling back to source-based heuristics (presence of the "async" keyword).
 *
 * @requires {@linkcode toFunctionString}
 *
 * @example
 * isAsyncFunction(async () => {})         // true
 * isAsyncFunction(async function () {})   // true
 * isAsyncFunction(cb => new Promise(cb))  // false (missing keyword)
 * isAsyncFunction({ async() {} }.async)   // false (its name is "async")
 * isAsyncFunction((async x => x).bind())  // false (detected as native)
 *
 * @since 3.0.0
 */
export const isAsyncFunction = (value: unknown): value is (...args: any[]) => Promise<any> => {
    if (typeof value !== "function") return false;

    return toFunctionString(value).startsWith("[Async");
};
