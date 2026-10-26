import { toFunctionString, isAsyncGeneratorFunction } from "../index.js";

/**
 * Checks whether a value is a non-async generator function.
 *
 * Detection relies on the string created by `toFunctionString`.
 *
 * Use {@linkcode isAsyncGeneratorFunction} to detect async ones.
 *
 * @requires {@linkcode toFunctionString}
 *
 * @example
 * isGeneratorFunction(function* () {})           // true
 * isGeneratorFunction({ *method() {} }.method)   // true
 * isGeneratorFunction(async function* () {})     // false (it's async)
 * isGeneratorFunction((function* () {}).bind())  // false (detected as native)
 *
 * @since 3.0.0
 */
export const isGeneratorFunction = <T>(value: T): value is T & GeneratorFunction => {
    if (typeof value !== "function") return false;

    return toFunctionString(value).startsWith("[Generator");
};
