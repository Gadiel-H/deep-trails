import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an asynchronous function according to its string representation ("async" keyword).
 *
 * @example
 * isAsyncFunction(async () => {})         // true
 * isAsyncFunction(async function () {})   // true
 * isAsyncFunction(() => new Promise(cb))  // false
 * isAsyncFunction({ async() {} }.async)   // false
 */
export const isAsyncFunction = (fn: unknown): fn is (...args: any[]) => Promise<any> => {
    if (typeof fn !== "function") return false;

    return toFunctionString(fn).startsWith("[Async");
};
