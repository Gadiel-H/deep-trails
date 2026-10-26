import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an async generator function.
 *
 * Detection relies on the string created by `toFunctionString`.
 *
 * @requires {@linkcode toFunctionString}
 *
 * @example
 * isAsyncGeneratorFunction(async function* () {})           // true
 * isAsyncGeneratorFunction({ async *method() {} }.method)   // true
 * isAsyncGeneratorFunction((async function* () {}).bind())  // false (detected as native)
 *
 * @since 3.0.0
 */
export const isAsyncGeneratorFunction = <T>(
    value: T
): value is T & ((...args: unknown[]) => AsyncIterableIterator<unknown, unknown, unknown>) => {
    if (typeof value !== "function") return false;

    return toFunctionString(value).startsWith("[AsyncGenerator");
};
