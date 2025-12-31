import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an asynchronous function
 * according to its string representation ("async" keyword).
 *
 * @example
 * isAsyncFunction(async () => {})         // true
 * isAsyncFunction(async function () {})   // true
 * isAsyncFunction(cb => new Promise(cb))  // false (missing keyword)
 * isAsyncFunction({ async() {} }.async)   // false (its name is "async")
 *
 * @since 3.0.0-beta.1
 */
export const isAsyncFunction = (value: unknown): value is (...args: any[]) => Promise<any> => {
    if (typeof value !== "function") return false;

    return toFunctionString(value).startsWith("[Async");
};
